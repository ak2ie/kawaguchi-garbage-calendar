import * as moment from 'moment';

export class GarbageCalendar {
    private pageTitle: string;
    private calender: HTMLTableElement;

    public constructor(pageTitle: string, calendar: HTMLTableElement) {
        this.pageTitle = pageTitle;
        this.calender = calendar;
    }

    public async highlightToday() {
        const date = moment(new Date()).format('D');
        let title: string = moment(new Date()).format('YYYY年MM月');

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
    }

    private getPageTitle(): string {
        return this.pageTitle;
    }

    private getCalendar(): HTMLTableElement {
        return this.calender;
    }

    private async highlightCell(cell: HTMLTableCellElement) {
        const color = await this.loadSetting();
        console.log(color);

        // すでに設定されているクラスを除去
        for (let index = 0; index < cell.classList.length; index++) {
            let className = cell.classList[index];

            if (className.startsWith('kawaguchi-garbage-calendar-')) {
                cell.classList.remove(className);
            }
        }

        if (color.backgroundColor !== null && color.backgroundColor !== undefined) {
            cell.classList.add(color.backgroundColor);
            console.log(color.backgroundColor);
        } else {
            // 背景色が未設定の場合
            cell.classList.add('kawaguchi-garbage-calendar-yellow');
        }
    }

    private isTodaysCell(cell: HTMLTableCellElement, date: string): boolean {
        // カレンダーの日付
        // （日付+回収対象のゴミの名前 の形式で取得できるため、日付のみを抽出）
        const pageDateStr = cell.innerText.split(/\r\n|\r|\n/)[0].trim();

        if (pageDateStr === date) {
            return true;
        } else {
            return false;
        }
    }

    private async loadSetting(): Promise<Setting> {
        return new Promise<Setting>((resolve, reject) => {
            let setting = new Setting();

            chrome.storage.sync.get('backgroundColor', function(result) {
                setting.backgroundColor = result.backgroundColor;
                resolve(setting);
            });
        });
    }
}

class Setting {
    public backgroundColor: string;
}