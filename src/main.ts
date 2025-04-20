import path from "node:path";
import fs from "node:fs";

import open from "open";
import { z } from "zod";

import { Flow } from "./lib/flow";
import { StockApiResponse } from "./utils/Stock";

const events = ["selectStock", "openLink"] as const;
type Events = (typeof events)[number];

const flow = new Flow<Events>("assets/stock-link.png");

const dataPath = path.join(__dirname, "../stock-items.json");
const raw = fs.readFileSync(dataPath, "utf-8");
const stockList: StockApiResponse = JSON.parse(raw);

const ACTION_KEYWORD = "sl";

flow.on("query", (params) => {
	const [query] = z.array(z.string()).parse(params);

	if (query.startsWith("종목링크 ")) {
		const name = query.replace("종목링크 ", "").trim();
		const stock = stockList.OutBlock_1.find((item) => item.ISU_ABBRV === name);
		if (!stock) return;
		//
		const code = stock.ISU_SRT_CD;

		const naverNewsQuery = new URLSearchParams({
			query: name,
			where: "news",
			sort: "1",
		});
		const newsURL = `https://search.naver.com/search.naver?${naverNewsQuery}`;
		const financeURL = `https://finance.naver.com/item/main.nhn?code=${code}`;
		const boardUrl = `https://finance.naver.com/item/board.naver?code=${code}`;

		const threadsQuery = new URLSearchParams({
			q: name,
			serp_type: "default",
			filter: "recent",
		});

		const threadsURL = `https://www.threads.net/search?${threadsQuery}`;

		const tossAnalyticsURL = `https://tossinvest.com/stocks/A${code}/analytics`;

		const judalQuery = new URLSearchParams({
			query: name,
			view: "search",
		});

		const judalURL = `https://www.judal.co.kr/?${judalQuery}`;

		flow.showResult(
			{
				title: `${name} - 스레드 검색`,
				subtitle: threadsURL,
				method: "openLink",
				parameters: [threadsURL],
				iconPath: path.join(__dirname, "../assets/threads.png"),
			},
			{
				title: `${name} - 토스 종목정보`,
				subtitle: tossAnalyticsURL,
				method: "openLink",
				parameters: [tossAnalyticsURL],
				iconPath: path.join(__dirname, "../assets/toss.png"),
			},
			{
				title: `${name} - 주달 검색`,
				subtitle: judalURL,
				method: "openLink",
				parameters: [judalURL],
				iconPath: path.join(__dirname, "../assets/judal.png"),
			},
			{
				title: `${name} - 네이버 뉴스`,
				subtitle: newsURL,
				method: "openLink",
				parameters: [newsURL],
				iconPath: path.join(__dirname, "../assets/naver.png"),
			},
			{
				title: `${name} - 종합정보`,
				subtitle: financeURL,
				method: "openLink",
				parameters: [financeURL],
				iconPath: path.join(__dirname, "../assets/naver.png"),
			},
			{
				title: `${name} - 종목토론방`,
				subtitle: boardUrl,
				method: "openLink",
				parameters: [boardUrl],
				iconPath: path.join(__dirname, "../assets/naver.png"),
			}
		);
		return;
	}

	// 일반 종목 검색
	const results = stockList.OutBlock_1.filter(
		(stock) => stock.ISU_ABBRV.includes(query) || stock.ISU_SRT_CD.includes(query)
	)
		.slice(0, 5)
		.map((stock) => ({
			title: `${stock.ISU_ABBRV} (${stock.ISU_SRT_CD})`,
			subtitle: `시가: ${stock.TDD_OPNPRC} | 종가: ${stock.TDD_CLSPRC} | 등락률: ${stock.FLUC_RT}%`,
			// method: "selectStock" as Events,
			// parameters: [stock.ISU_SRT_CD],
			method: "Flow.Launcher.ChangeQuery" as Events,
			parameters: [`${ACTION_KEYWORD} 종목링크 ${stock.ISU_ABBRV}`, true],
			dontHideAfterAction: true,
		}));

	if (results.length === 0) {
		flow.showResult({
			title: `"${query}"에 해당하는 종목이 없습니다.`,
			subtitle: "다시 입력해 주세요.",
		});
	} else {
		flow.showResult(...results);
	}
});

flow.on("selectStock", (params) => {
	const [name] = z.array(z.string()).parse(params);
	// 👉 changeQuery 호출
	flow.changeQuery({ query: `${ACTION_KEYWORD} 종목링크 ${name}`, requery: true });
});

flow.on("openLink", (params) => {
	// const [url] = z.array(z.string().url()).parse(params); // url() 매서드가 에러를 던짐 -> url 형식 맞는데도?? 이상함.
	const [url] = z.array(z.string()).parse(params);

	open(url);
});

flow.run();
