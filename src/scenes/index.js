import Stage from "telegraf/stage";
import add from "./add";
import sub from "./sub";
import remove from "./remove";
import balance from "./balance";
import view from "./view";
import history from "./history";
import report from "./report";

const stage = new Stage();

stage.register(add);
stage.register(sub);
stage.register(remove);
stage.register(balance);
stage.register(view);
stage.register(history);
stage.register(report);

export default stage.middleware();
