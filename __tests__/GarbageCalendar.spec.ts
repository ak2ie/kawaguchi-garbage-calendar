import { GarbageCalendar } from "../app/scripts/GarbageCalendar";
import { clear, advanceTo } from "jest-date-mock";

describe("背景色変更", () => {
  afterEach(() => {
    // Dateモック解除
    clear();
  });

  it("1月から9月", async () => {
    document.body.innerHTML = `
        <div class="calenderTitle">2018年 1月</div>
        <table class="calendarTable">
            <tbody>
                <tr>
                    <td>10</td>
                </tr>
            </tbody>
        </table>
        `;

    /* ---------------------------------------
            モックを用意
           --------------------------------------- */
    // 背景色の設定を返す
    chrome.storage.sync.get.mockImplementation((key, callback) => {
      callback({
        backgroundColor: "kawaguchi-garbage-calendar-yellow"
      });
    });

    advanceTo(new Date("2018/01/10 10:10:10"));

    /* ---------------------------------------
            テスト対象メソッドを実行
           --------------------------------------- */
    const garbageCalendar = new GarbageCalendar();
    await garbageCalendar.highlightToday();

    /* ---------------------------------------
            実行結果を確認
           --------------------------------------- */
    const element = document.getElementsByClassName(
      "kawaguchi-garbage-calendar-yellow"
    );

    expect(element[0].innerHTML).toBe("10");
  });

  it("10月から12月", async () => {
    document.body.innerHTML = `
        <div class="calenderTitle">2018年10月</div>
        <table class="calendarTable">
            <tbody>
                <tr>
                    <td>10</td>
                </tr>
            </tbody>
        </table>
        `;

    /* ---------------------------------------
            モックを用意
           --------------------------------------- */
    // 背景色の設定を返す
    chrome.storage.sync.get.mockImplementation((key, callback) => {
      callback({
        backgroundColor: "kawaguchi-garbage-calendar-yellow"
      });
    });

    advanceTo(new Date("2018/10/10 10:10:10"));

    /* ---------------------------------------
            テスト対象メソッドを実行
           --------------------------------------- */
    const garbageCalendar = new GarbageCalendar();
    await garbageCalendar.highlightToday();

    /* ---------------------------------------
            実行結果を確認
           --------------------------------------- */
    const element = document.getElementsByClassName(
      "kawaguchi-garbage-calendar-yellow"
    );

    expect(element[0].innerHTML).toBe("10");
  });

  it("ゴミ回収あり", async () => {
    document.body.innerHTML = `
        <div class="calenderTitle">2018年 1月</div>
        <table class="calendarTable">
            <tbody>
                <tr>
                    <td>9<div class="p4 calendarTxt"><a href="https://example.com/" target="_blank">びん</a></div></td>
                </tr>
            </tbody>
        </table>
        `;

    /* ---------------------------------------
            モックを用意
           --------------------------------------- */
    // 背景色の設定を返す
    chrome.storage.sync.get.mockImplementation((key, callback) => {
      callback({
        backgroundColor: "kawaguchi-garbage-calendar-yellow"
      });
    });

    advanceTo(new Date("2018/01/09 10:10:10"));

    /* ---------------------------------------
            テスト対象メソッドを実行
           --------------------------------------- */
    const garbageCalendar = new GarbageCalendar();
    await garbageCalendar.highlightToday();

    /* ---------------------------------------
            実行結果を確認
           --------------------------------------- */
    const element = document.getElementsByClassName(
      "kawaguchi-garbage-calendar-yellow"
    );

    expect(element[0].innerHTML).toBe(
      '9<div class="p4 calendarTxt"><a href="https://example.com/" target="_blank">びん</a></div>'
    );
  });

  it("日付バリエーション", async () => {
    document.body.innerHTML = `
        <div class="calenderTitle">2018年 1月</div>
        <table class="calendarTable">
            <tbody>
                <tr>
                    <td></td>
                    <td>8</td>
                    <td>9<div class="p4 calendarTxt"><a href="https://example.com/" target="_blank">びん</a></div></td>
                    <td>10<div class="p4 calendarTxt"><a href="https://example.com/" target="_blank">かん</a></div></td>
                </tr>
            </tbody>
        </table>
        `;

    /* ---------------------------------------
            モックを用意
           --------------------------------------- */
    // 背景色の設定を返す
    chrome.storage.sync.get.mockImplementation((key, callback) => {
      callback({
        backgroundColor: "kawaguchi-garbage-calendar-yellow"
      });
    });

    advanceTo(new Date("2018/01/10 10:10:10"));

    /* ---------------------------------------
            テスト対象メソッドを実行
           --------------------------------------- */
    const garbageCalendar = new GarbageCalendar();
    await garbageCalendar.highlightToday();

    /* ---------------------------------------
            実行結果を確認
           --------------------------------------- */
    const element = document.getElementsByClassName(
      "kawaguchi-garbage-calendar-yellow"
    );

    expect(element[0].innerHTML).toBe(
      '10<div class="p4 calendarTxt"><a href="https://example.com/" target="_blank">かん</a></div>'
    );
  });
});

describe("設定値取得", () => {
  afterEach(() => {
    // Dateモック解除
    clear();
  });

  it("保存された値あり", async () => {
    document.body.innerHTML = `
        <div class="calenderTitle">2018年 1月</div>
        <table class="calendarTable">
            <tbody>
                <tr>
                    <td>10</td>
                </tr>
            </tbody>
        </table>
        `;

    /* ---------------------------------------
            モックを用意
           --------------------------------------- */
    // 背景色の設定を返す
    chrome.storage.sync.get.mockImplementation((key, callback) => {
      callback({
        backgroundColor: "kawaguchi-garbage-calendar-blue"
      });
    });

    advanceTo(new Date("2018/01/10 10:10:10"));

    /* ---------------------------------------
            テスト対象メソッドを実行
           --------------------------------------- */
    const garbageCalendar = new GarbageCalendar();
    await garbageCalendar.highlightToday();

    /* ---------------------------------------
            実行結果を確認
           --------------------------------------- */
    // 保存された値が反映される
    const element = document.getElementsByClassName(
      "kawaguchi-garbage-calendar-blue"
    );

    expect(element.length).toBe(1);
  });

  it("保存された値なし", async () => {
    document.body.innerHTML = `
        <div class="calenderTitle">2018年 1月</div>
        <table class="calendarTable">
            <tbody>
                <tr>
                    <td>10</td>
                </tr>
            </tbody>
        </table>
        `;

    /* ---------------------------------------
            モックを用意
           --------------------------------------- */
    // 背景色の設定を返す
    chrome.storage.sync.get.mockImplementation((key, callback) => {
      callback({});
    });

    advanceTo(new Date("2018/01/10 10:10:10"));

    /* ---------------------------------------
            テスト対象メソッドを実行
           --------------------------------------- */
    const garbageCalendar = new GarbageCalendar();
    await garbageCalendar.highlightToday();

    /* ---------------------------------------
            実行結果を確認
           --------------------------------------- */
    // 規定値が設定される
    const element = document.getElementsByClassName(
      "kawaguchi-garbage-calendar-yellow"
    );

    expect(element.length).toBe(1);
  });
});

describe("休日表示", () => {
  it("土曜", async () => {
    document.body.innerHTML = `
        <div class="calenderTitle">2018年 1月</div>
        <table class="calendarTable">
            <tbody>
                <tr>
                    <td>日</td>
                    <td>月</td>
                    <td>火</td>
                    <td>水</td>
                    <td>木</td>
                    <td>金</td>
                    <td>土</td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>10<div class="p1 calendarTxt"><a href="https://example.com" target="_blank">プラ</a></div></td>
                    <td>21</td>
                    <td>13<div class="p2 calendarTxt"><a href="https://example.com" target="_blank">一般</a></div><div class="p2 calendarTxt"></td>
                    <td>14</td>
                </tr>
            </tbody>
        </table>
        `;

    /* ---------------------------------------
            テスト対象メソッドを実行
           --------------------------------------- */
    const garbageCalendar = new GarbageCalendar();
    garbageCalendar.colorizeHoliday();

    /* ---------------------------------------
            実行結果を確認
           --------------------------------------- */
    // 「土」の文字
    const titleTbody = document.getElementsByTagName("tbody")[0];
    const saturdayTitleElement = titleTbody.getElementsByTagName("td")[6];
    expect(saturdayTitleElement.innerHTML).toBe("<span class=\"saturday-color\">土</span>");

    // 土曜日の日付
    const contentTbody = document.getElementsByTagName("tbody")[1];
    const saturdayContentElement = contentTbody.getElementsByTagName("td")[6];
    expect(saturdayContentElement.innerHTML).toBe("<span class=\"saturday-color\">14</span>");
  });

  it("日曜", async () => {
    document.body.innerHTML = `
        <div class="calenderTitle">2018年 1月</div>
        <table class="calendarTable">
            <tbody>
                <tr>
                    <td>日</td>
                    <td>月</td>
                    <td>火</td>
                    <td>水</td>
                    <td>木</td>
                    <td>金</td>
                    <td>土</td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13<div class="p1 calendarTxt"><a href="https://example.com" target="_blank">プラ</a></div></td>
                    <td>14</td>
                    <td>15<div class="p2 calendarTxt"><a href="https://example.com" target="_blank">一般</a></div><div class="p2 calendarTxt"></td>
                    <td>16</td>
                </tr>
            </tbody>
        </table>
        `;

    /* ---------------------------------------
            テスト対象メソッドを実行
           --------------------------------------- */
    const garbageCalendar = new GarbageCalendar();
    garbageCalendar.colorizeHoliday();

    /* ---------------------------------------
            実行結果を確認
           --------------------------------------- */
    // 「日」の文字
    const titleTbody = document.getElementsByTagName("tbody")[0];
    const saturdayTitleElement = titleTbody.getElementsByTagName("td")[0];
    expect(saturdayTitleElement.innerHTML).toBe("<span class=\"sunday-color\">日</span>");

    // 日曜の日付
    const contentTbody = document.getElementsByTagName("tbody")[1];
    const saturdayContentElement = contentTbody.getElementsByTagName("td")[0];
    expect(saturdayContentElement.innerHTML).toBe("<span class=\"sunday-color\">10</span>");
  });

  it("祝日", async () => {
    document.body.innerHTML = `
        <div class="calenderTitle">2018年 1月</div>
        <table class="calendarTable">
            <tbody>
                <tr>
                    <td>日</td>
                    <td>月</td>
                    <td>火</td>
                    <td>水</td>
                    <td>木</td>
                    <td>金</td>
                    <td>土</td>
                </tr>
            </tbody>
            <tbody>
                <tr>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                    <td>13<div class="p1 calendarTxt"><a href="https://example.com" target="_blank">プラ</a></div></td>
                    <td>14</td>
                    <td>15<div class="p2 calendarTxt"><a href="https://example.com" target="_blank">一般</a></div><div class="p2 calendarTxt"></td>
                    <td>16</td>
                </tr>
            </tbody>
        </table>
        `;

    /* ---------------------------------------
            テスト対象メソッドを実行
           --------------------------------------- */
    const garbageCalendar = new GarbageCalendar();
    garbageCalendar.colorizeHoliday();

    /* ---------------------------------------
            実行結果を確認
           --------------------------------------- */
    const contentTbody = document.getElementsByTagName("tbody")[1];
    const saturdayContentElement = contentTbody.getElementsByTagName("td")[3];
    expect(saturdayContentElement.innerHTML).toBe("<span class=\"holiday-color\">13</span><div class=\"p1 calendarTxt\"><a href=\"https://example.com\" target=\"_blank\">プラ</a></div>");
  });
});
