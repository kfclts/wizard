export type Focus = "氣色" | "體力" | "睡眠" | "消化";

export type Option = {
  key: string;
  label: string;
  score?: number;
  focus?: Focus;
};

export type Question = {
  id: string;
  title: string;
  prompt: string;
  options: Option[];
};

export type Answer = { qid: string; title: string; option: Option };

export function encodeState(obj: any): string {
  try {
    const json = JSON.stringify(obj);
    if (typeof window !== "undefined" && (window as any).btoa) {
      return btoa(unescape(encodeURIComponent(json)));
    }
    return encodeURIComponent(json);
  } catch {
    return "";
  }
}

export function decodeState(s: string): any | null {
  try {
    const raw = (() => {
      try { return decodeURIComponent(s); } catch { return s; }
    })();
    try {
      return JSON.parse(atob(raw));
    } catch {
      return JSON.parse(raw);
    }
  } catch {
    return null;
  }
}

export function sumScore(answers: Answer[]): number {
  return answers
    .filter(a => a.qid !== "Q7")
    .reduce((acc, a) => acc + (a.option.score ?? 0), 0);
}

export function pickFocus(answers: Answer[]): Focus | undefined {
  const a7 = answers.find(a => a.qid === "Q7");
  return a7?.option.focus as Focus | undefined;
}

export function profileByScore(total: number) {
  if (total >= 18) {
    return {
      key: "靈氣充盈型",
      range: "18–21分",
      feature: "體質均衡，氣血旺盛，但需持續保養以維持亮麗光澤。",
      bird: "凰啼初盞",
      plan: "每週 2–3 次，早晨空腹食用『凰啼初盞』；可加入少量安永鮮物『花旗蔘氣養湯』或『四神健脾湯』作為氣養搭配。",
      quote: "持盈保泰，乃養生之道。氣滿，則神明自華。",
      soups: ["花旗蔘氣養湯", "四神健脾湯"],
      time: "早晨",
    } as const;
  }
  if (total >= 13) {
    return {
      key: "氣血雙虛型",
      range: "13–17分",
      feature: "容易疲倦、頭暈，女性常有氣色不佳現象。",
      bird: "潤若朝霞",
      plan: "每週 3–4 次，晚餐後 1 小時食用『潤若朝霞』；可搭配安永鮮物『當歸鴨湯』或『藥膳排骨湯』溫補氣血。",
      quote: "氣為血帥，血為氣母；兩虛之時，燕窩溫養最宜。",
      soups: ["當歸鴨湯", "藥膳排骨湯"],
      time: "晚餐後",
    } as const;
  }
  if (total >= 9) {
    return {
      key: "陰虛火旺型",
      range: "9–12分",
      feature: "熬夜多、睡眠差、口乾舌燥，容易長痘或燥熱。",
      bird: "瑤光夜盞",
      plan: "每週 3 次，晚間食用『瑤光夜盞』；搭配安永鮮物『蓮子百合養心湯』或『枸杞雞湯』有助滋陰養心。",
      quote: "夜深時，讓月華與燕窩一同撫平你的燥與火。",
      soups: ["蓮子百合養心湯", "枸杞雞湯"],
      time: "晚間",
    } as const;
  }
  if (total >= 7) {
    return {
      key: "陽氣不足型",
      range: "7–8分",
      feature: "手腳冰冷、代謝低、容易疲倦。",
      bird: "凰啼初盞",
      plan: "每週 4 次，早晨溫熱食用『凰啼初盞』；搭配安永鮮物『薑母雞湯』或『人蔘燉雞湯』，助陽生氣。",
      quote: "陽升則生，陽退則衰。溫一盞晨光，重啟體內暖流。",
      soups: ["薑母雞湯", "人蔘燉雞湯"],
      time: "早晨",
    } as const;
  }
  return {
    key: "氣鬱體滯型",
    range: "6分以下",
    feature: "壓力大、睡不安、情緒起伏、消化不良。",
    bird: "潤若朝霞",
    plan: "每週 2–3 次，午後食用『潤若朝霞』；搭配安永鮮物『養肝舒氣湯』或『香附平衡湯』舒緩氣鬱。",
    quote: "情緒為氣之主。養氣即養心，心開則百脈順。",
    soups: ["養肝舒氣湯", "香附平衡湯"],
    time: "午後",
  } as const;
}

export function focusTip(focus?: Focus): string | undefined {
  switch (focus) {
    case "氣色":
      return "可加強鐵質與優質蛋白來源，並維持規律作息。";
    case "體力":
      return "建議早晨或運動後補充，並留意蛋白質與碳水的均衡。";
    case "睡眠":
      return "晚間清淡、避免刺激性飲食，搭配安神湯品更佳。";
    case "消化":
      return "少量多餐、減少油炸甜食，四神健脾類湯品有助。";
  }
}
