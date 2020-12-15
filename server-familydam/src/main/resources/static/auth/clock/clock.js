
class Clock extends HTMLElement {

    constructor() {
        super();
        this.timestamp = new Date();
        this.element = this.constructHtml();
    }

    connectedCallback(){
        const _this = this;
        this.timer = setInterval(()=>{
            //console.log("clock timer, tick tock")
            let timestamp = new Date();
            this.element.innerHTML = timestamp.toLocaleTimeString();
        }, 1000);
    }

    disconnectedCallback(){
        clearInterval(this.timer);
    }

    constructHtml() {
        //console.log('[Clock] render()');
        const shadow = this.attachShadow({mode: 'open'});
        const wrapper = document.createElement('div');
        wrapper.setAttribute("class", "clock");
        wrapper.innerHTML = this.timestamp.toLocaleTimeString();

        const style = document.createElement('style');
        style.textContent = `
          .wrapper {
            position: relative;
          }
        `;
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        return wrapper;
    }
}

customElements.define('auth-clock', Clock);
