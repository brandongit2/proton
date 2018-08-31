import {resizePanel} from './actions';
import store from './store';

export class PanelList {
    constructor(direction, path) {
        this.direction = direction;
        this.path = path;
        this.idList = [];

        this.addId = this.addId.bind(this);
        this.onDividerClick = this.onDividerClick.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    addId(id) {
        for (let argument of arguments) {
            this.idList.push(argument);
            console.log(`${this.path}: ${this.idList}`);
        }
    }

    onDividerClick(id, mouseDelta) {
        let dividerIndex = this.idList.findIndex(el => el === id);

        if (dividerIndex > 0 && dividerIndex < this.idList.length - 1) {
            console.log(dividerIndex);
            let indexOfPanelBefore = dividerIndex - 1;
            let indexOfPanelAfter = dividerIndex + 1;
            store.dispatch(resizePanel(
                indexOfPanelBefore,
                indexOfPanelAfter,
                this.direction === 'horizontal' ? 'vertical' : 'horizontal',
                this.path,
                mouseDelta
            ));
        }
    }
}
