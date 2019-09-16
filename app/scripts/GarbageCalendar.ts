import * as moment from "moment";
import * as holidays from "./holiday.json";

export class GarbageCalendar {
  private pageTitle: string;
  private calender: HTMLTableElement;

  public async highlightToday() {
    try {
      const SEPTEMBER = 8;
      const today = new Date();
      const date = moment(today).format("D");
      let title: string = moment(today).format("YYYY年");
      if (moment(today).month() <= SEPTEMBER) {
        // 「月」をスペース埋め
        title += " ";
      }
      title += moment(today).format("M月");

      const page_title = this.getPageTitle();

      if (title === page_title) {
        const calendar = this.getCalendar();

        for (let i = 0; i < calendar.rows.length; i++) {
          const row = calendar.rows[i].cells;
          for (let k = 0; k < row.length; k++) {
            const cell = <HTMLTableCellElement>row[k];
            if (this.isTodaysCell(cell, date)) {
              await this.highlightCell(cell);
            }
          }
        }
      }
    } catch (e) {
      this.reportError();
    }
  }

  public colorizeHoliday() {
    const saturdyIndex = 6;
    const sundayIndex = 0;
    const calendar = this.getCalendar();
    const title = this.getPageTitle();

    for (let i = 0; i < calendar.rows.length; i++) {
      const weekRow = calendar.rows[i].cells;
      for (let k = 0; k < weekRow.length; k++) {
        const cell = <HTMLTableCellElement>weekRow[k];

        if (k === saturdyIndex) {
            // 「土」または日付の数字のみを青色にする
            const regexp = /[土0-9]+/;
            cell.innerHTML = cell.innerHTML.replace(regexp, "<span class=\"saturday-color\">$&</span>");
        } else if (k === sundayIndex) {
            // 「日」または日付の数字のみを青色にする
            const regexp = /[日0-9]+/;
            cell.innerHTML = cell.innerHTML.replace(regexp, "<span class=\"sunday-color\">$&</span>");
        }
      }
    }
  }

  private getPageTitle(): string {
    const pageTitleElement = <HTMLElement>(
      document.getElementsByClassName("calenderTitle")[0]
    );
    let pageTitle = <string>pageTitleElement.innerHTML;

    if (
      pageTitle === null ||
      pageTitle === undefined ||
      pageTitle.trim() === ""
    ) {
      throw new Error("年月の取得に失敗");
    }

    pageTitle = pageTitle.trim();

    return pageTitle;
  }

  private getCalendar(): HTMLTableElement {
    const calendar = <HTMLTableElement>(
      document.getElementsByClassName("calendarTable")[0]
    );

    if (calendar === null) {
      throw new Error("カレンダー要素取得に失敗");
    }

    return calendar;
  }

  private async highlightCell(cell: HTMLTableCellElement) {
    const color = await this.loadSetting();

    // すでに設定されているクラスを除去
    for (let index = 0; index < cell.classList.length; index++) {
      let className = cell.classList[index];

      if (className.startsWith("kawaguchi-garbage-calendar-")) {
        cell.classList.remove(className);
      }
    }

    if (color.backgroundColor !== null && color.backgroundColor !== undefined) {
      cell.classList.add(color.backgroundColor);
    } else {
      // 背景色が未設定の場合
      cell.classList.add("kawaguchi-garbage-calendar-yellow");
    }
  }

  private isTodaysCell(cell: HTMLTableCellElement, date: string): boolean {
    // カレンダーの日付
    // （日付+回収対象のゴミの名前 の形式で取得できるため、日付のみを抽出）
    const dateRegexp = /([0-9]+)[<.]*/;
    const pageDateStr = dateRegexp.exec(cell.innerHTML);

    if (pageDateStr === null || pageDateStr.length <= 1) {
      // 日付のセルでない場合
      return false;
    } else if (pageDateStr[1] === date) {
      return true;
    } else {
      return false;
    }
  }

  private async loadSetting(): Promise<Setting> {
    return new Promise<Setting>((resolve, reject) => {
      let setting = new Setting();

      chrome.storage.sync.get("backgroundColor", function(result: {
        [key: string]: string;
      }) {
        setting.backgroundColor = result.backgroundColor;
        resolve(setting);
      });
    });
  }

  private reportError() {
    chrome.tabs.query(
      {
        url: "http://kawaguchi-gomimaru.jp/calendar/*"
      },
      tabs => {
        if (tabs.length >= 1 && "id" in tabs[0]) {
          let tabId = tabs[0].id;
          if (typeof tabId === "number") {
            chrome.tabs.sendMessage(
              tabId,
              {
                type: "ERROR"
              },
              () => {}
            );
          }
        }
      }
    );
  }
}

class Setting {
  public backgroundColor: string;
}
