// import fetch from "node-fetch";
//
export interface StockItem {
	ISU_SRT_CD: string; // 종목 코드 (단축코드)
	ISU_CD: string; // 종목 코드 (풀코드)
	ISU_ABBRV: string; // 종목 약어
	MKT_NM: string; // 시장명 (예: KOSPI, KOSDAQ)
	SECT_TP_NM: string; // 소속부 (예: 중견기업부, 우량기업부 등)
	TDD_CLSPRC: string; // 당일 종가
	FLUC_TP_CD: string; // 등락 구분 (1: 상승, 2: 하락 등)
	CMPPREVDD_PRC: string; // 전일 대비 가격
	FLUC_RT: string; // 등락률
	TDD_OPNPRC: string; // 당일 시가
	TDD_HGPRC: string; // 당일 고가
	TDD_LWPRC: string; // 당일 저가
	ACC_TRDVOL: string; // 누적 거래량
	ACC_TRDVAL: string; // 누적 거래대금
	MKTCAP: string; // 시가총액
	LIST_SHRS: string; // 상장 주식 수
	MKT_ID: string; // 시장 ID (KSQ: KOSDAQ, STK: KOSPI)
}

export interface StockApiResponse {
	OutBlock_1: StockItem[];
	CURRENT_DATETIME: string; // "2025.04.18 PM 12:12:17"
}

// const KRX_URL = "http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd";
//
// const headers = {
// 	"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
// 	Referer: "http://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC0201020101",
// };
//
// const body = new URLSearchParams({
// 	bld: "dbms/MDC/STAT/standard/MDCSTAT01501",
// 	locale: "ko_KR",
// 	mktId: "ALL",
// 	trdDd: getTodayAsYYYYMMDD(),
// 	share: "1",
// 	money: "1",
// 	csvxls_isNo: "false",
// });
// //
// const response = await fetch(KRX_URL, {KRX_URL
// 	method: "POST",
// 	headers,
// 	body,
// });
// //
// const stockList = await response.json() as any;
// //
// // // json.OutBlock_1
// //
// const match = (stockList.OutBlock_1 as Array<any>).find(
// 	(item) => item.ISU_ABBRV === query || item.ISU_SRT_CD === query
// );
//
// export default class Stock {
// 	stockItems: StockItem[];
// 	constructor() {
// 		this.stockItems = [];
// 	}
// }
//
//
// function getTodayAsYYYYMMDD() {
// 	const today = new Date();
// 	const yyyy = today.getFullYear();
// 	const mm = String(today.getMonth() + 1).padStart(2, "0");
// 	const dd = String(today.getDate()).padStart(2, "0");
// 	return `${yyyy}${mm}${dd}`;
// }
