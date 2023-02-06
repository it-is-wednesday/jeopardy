import { parseXlsx } from "./excel";
import type { StateUpdater } from "preact/hooks";
import type { State } from "./index";
import { route } from "preact-router";

type Props = { setState: StateUpdater<State> };

function FileInput({ setState }: Props) {
  const onChange = async (event: any) => {
    // @ts-ignore
    const uploadedFile = await event.target!.files[0].arrayBuffer();
    setState(parseXlsx(uploadedFile));
    route("/splash");
  };

  return <input type="file" onChange={onChange}></input>;
}

export function WelcomePage({ setState }: Props) {
  return (
    <div className="intro-explanation" dir="rtl">
      <div dir="ltr">
        <FileInput setState={setState} />
      </div>
      <h1>זה המסך שהצופים לא אמורים לראות</h1>
      <p>
        <ol>
          <li>
            תעלו קובץ אקסל עם שאלות,
            {" "} <a href="./example.xlsx">הנה אחד לדוגמה</a> {" "}
            שתדעו איך המבנה אמור להראות וזה
          </li>
          <li>
            <div>
              {" "}
              אחרי שתעלו את הקובץ, יהיה מסך ספלאש. בשביל להתחיל את השעשועון,
              תלחצו על העכבר לחיצה רגילה{" "}
            </div>
            <div>
              {" "}
              בכל מקום. אם לחצתם בטעות הכל טוב, אפשר לחזור לספלאש עם הכפתור
              אחורה בדפדפן{" "}
            </div>
          </li>
          <li>
            כשאתם בתוך שאלה, אפשר לחזור אחורה בכמה דרכים:
            <ul>
              <li>כפתור backspace</li>
              <li>
                <div> כפתור אחורה בדפדפן, או הקיצורי מקלדת שלו: </div>
                <div>
                  <code className="keybinding" dir="ltr">
                    control + ←
                  </code>
                  בווינדוס
                </div>
                <div>
                  <code className="keybinding" dir="ltr">
                    command + ←
                  </code>
                  במאק
                </div>
              </li>
            </ul>
          </li>
          <li>
            ברגע שנכנסתם לשאלה היא שרופה זהו אין חרטות!!! את חוזרת אחורה והשאלה
            שרופה זה בלתי הפיך. כמו לקמט נייר
          </li>
          <li>
            כנסו לפולסקרין עם
            <code className="keybinding">control + command + f</code>
            ואז בשביל להסתיר את הכרטיסיות תלחצו
            <code className="keybinding">shift + command + f</code>
          </li>
          <li>
            <div>
              שימו לב שאתם מעלים קובץ אקסל (סיומת <code>xlsx</code>) ולא קובץ{" "}
              <code>numbers</code>.
            </div>
            אם כתבתם בנאמברס אז אפשר עדיין לשמור כקובץ אקסל:
            <code dir="ltr" className="keybinding">
              {"File -> Export to -> Excel..."}
            </code>
          </li>
        </ol>
      </p>
    </div>
  );
}
