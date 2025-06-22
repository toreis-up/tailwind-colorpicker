import chroma from "chroma-js";
import { STEP_KEYS, type ColorElement } from "~/types/step";

export function generatePalette(baseList: ColorElement[]) {
  const specified = [];
  const unspecified = [];
  const usedIndices = new Set();

  baseList.forEach((item) => {
    const { hex, step } = item;
    // Chroma.js でHEXを検証し、無効ならエラー
    if (!chroma.valid(hex)) {
      throw new Error(`無効なHEXカラーコード「${hex}」が入力されました。`);
    }
    const lab = chroma(hex).lab();

    if (step !== null && step !== 'auto') {
      const idx = STEP_KEYS.indexOf(step);
      if (idx < 0)
        throw new Error(`無効なステップ値 ${step} が指定されました。`);
      if (usedIndices.has(idx))
        throw new Error(`ステップ ${step} が重複指定されています。`);
      specified.push({ index: idx, hex, lab });
      usedIndices.add(idx);
    } else {
      unspecified.push({ hex, lab });
    }
  });

  const freeArr = STEP_KEYS
    .map((_, idx) => idx)
    .filter((idx) => !usedIndices.has(idx))
    .sort((a, b) => a - b);

  if (unspecified.length > 0) {
    unspecified.sort((c1, c2) => c1.lab[0] - c2.lab[0]);
    const M = unspecified.length;
    const K = freeArr.length;
    if (K < M)
      throw new Error(
        `空きステップが不足しています（指定色 ${specified.length} + 自動 ${M} > ${STEP_KEYS.length}）。`
      );

    const freeArrCopy = [...freeArr];
    for (let i = 0; i < M; i++) {
      const chosenFreeArrIndex =
        M === 1 && K > 0
          ? Math.floor((freeArrCopy.length - 1) / 2)
          : Math.round((i * (freeArrCopy.length - 1)) / Math.max(1, M - 1)); // M-1が0になるのを防ぐ
      const chosenIdx = freeArrCopy[chosenFreeArrIndex];

      if (chosenIdx === undefined) {
        throw new Error(
          `自動配置中に利用可能な空きステップが見つかりませんでした。(${
            i + 1
          }色目)`
        );
      }

      specified.push({
        index: chosenIdx,
        hex: unspecified[i].hex,
        lab: unspecified[i].lab,
      });
      usedIndices.add(chosenIdx);
      freeArrCopy.splice(freeArrCopy.indexOf(chosenIdx), 1);
    }
  }

  specified.sort((a, b) => a.index - b.index);

  if (specified.length === 0 && baseList.length > 0) {
    throw new Error(
      "ベースカラーが指定されていませんが、自動配置する色がありません。"
    );
  }
  if (specified.length === 0) {
    const emptyResult = {};
    STEP_KEYS.forEach((key) => {
      emptyResult[key] = "#FFFFFF";
    });
    return emptyResult;
  }

  const finalPalette = Array(11).fill(null);
  specified.forEach((item) => {
    finalPalette[item.index] = item.hex;
  });

  for (let k = 0; k < specified.length - 1; k++) {
    const left = specified[k];
    const right = specified[k + 1];
    const gap = right.index - left.index - 1;
    if (gap <= 0) continue;
    for (let step = 1; step <= gap; step++) {
      const t = step / (gap + 1);
      finalPalette[left.index + step] = chroma
        .mix(left.hex, right.hex, t, "lch")
        .hex();
    }
  }

  if (specified.length > 0) {
    if (specified[0].index > 0) {
      const toHex = specified[0].hex;
      const lightHex = "#ffffff";
      const stepsToFill = specified[0].index;
      for (let i = 0; i < stepsToFill; i++) {
        const t = (i + 1) / (stepsToFill + 1);
        finalPalette[i] = chroma.mix(lightHex, toHex, t, "lch").hex();
      }
    }
    const last = specified[specified.length - 1];
    if (last.index < 10) {
      const fromHex = last.hex;
      const darkHex = "#000000";
      const stepsToFill = 10 - last.index;
      for (let j = 1; j <= stepsToFill; j++) {
        const t = j / (stepsToFill + 1);
        finalPalette[last.index + j] = chroma
          .mix(fromHex, darkHex, t, "lch")
          .hex();
      }
    }
  }

  const result = {};
  STEP_KEYS.forEach((key, idx) => {
    if (finalPalette[idx] === null && specified.length === 1) {
      result[key] = specified[0].hex;
    } else if (finalPalette[idx] === null) {
      result[key] = "#DDDDDD"; // より目立たないデフォルトグレーに変更
    } else {
      result[key] = finalPalette[idx];
    }
  });
  return result;
}

export interface Palette {
  [step: number]: string;
}

export interface RenderResultOptions {
  paletteObj: Palette;
  paletteName: string;
  stepKeys?: (number | string)[];
}

export interface RenderedPaletteResult {
  preview: {
    step: number | string;
    hex: string;
    hsl: string;
  }[];
  css: string;
  tailwindConfig: string;
  combined: string;
}

/**
 * パレット生成結果を整形して返す
 */
export function renderResult({
  paletteObj,
  paletteName,
  stepKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
}: RenderResultOptions): RenderedPaletteResult {
  // プレビュー用データ
  const preview = stepKeys
    .map((stepKey) => {
      const hex = paletteObj[stepKey];
      if (!hex) return null;
      const [hVal, sVal, lVal] = chroma(hex).hsl();
      const h = isNaN(hVal) ? 0 : Math.round(hVal);
      const s = Math.round(sVal * 100);
      const l = Math.round(lVal * 100);
      const hslString = `hsl(${h}, ${s}%, ${l}%)`;
      return {
        step: stepKey,
        hex: hex.toUpperCase(),
        hsl: hslString,
      };
    })
    .filter(Boolean) as { step: number | string; hex: string; hsl: string }[];

  // CSSカスタムプロパティ
  let cssOutput = "@layer base {\n";
  cssOutput += "  :root {\n";
  stepKeys.forEach((stepKey) => {
    const hex = paletteObj[stepKey];
    if (hex) {
      cssOutput += `    --color-${paletteName}-${stepKey}: ${hex.toUpperCase()};\n`;
    }
  });
  cssOutput += "  }\n";
  cssOutput += "}\n";

  // tailwind.config.js用コメント
  const tailwindConfigLines = [
    `\n\n/*`,
    `  上記をCSSファイル (例: main.css) に貼り付けた後、`,
    `  tailwind.config.js で以下のようにこのパレット ('${paletteName}') を利用できます：\n`,
    `  // tailwind.config.js`,
    `  export default {`,
    `    theme: {`,
    `      extend: {`,
    `        colors: {`,
    `          ${paletteName}: {`,
  ];
  stepKeys.forEach((stepKey) => {
    if (paletteObj[stepKey]) {
      tailwindConfigLines.push(
        `            ${stepKey}: 'rgb(var(--color-${paletteName}-${stepKey}) / <alpha-value>)',`
      );
    }
  });
  tailwindConfigLines.push(
    `          }`,
    `        }`,
    `      }`,
    `    }`,
    `  }`,
    `*/`
  );
  const tailwindConfigComment = tailwindConfigLines.join("\n");

  return {
    preview,
    css: cssOutput,
    tailwindConfig: tailwindConfigComment,
    combined: cssOutput + tailwindConfigComment,
  };
}