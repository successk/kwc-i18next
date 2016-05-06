(() => {
  "use strict";

  class KwcI18next {
    beforeRegister() {
      this.is = "kwc-i18next";

      this.properties = {
        key: {
          type: String,
          value: null,
          observer: "_update"
        },
        show: {
          type: Boolean,
          value: false
        },
        var: {
          type: String,
          value: null,
          readOnly: true,
          reflectToAttribute: true,
          notify: true,
          observer: "_updateDom"
        },
        notEscape: {
          type: Boolean,
          value: false,
          observer: "_update"
        }
      };
    }

    attached() {
      const that = this;
      this._isAttached = true;
      this._update();
      window.i18next.on("initialized", () => that._update());
      window.i18next.on("loaded", () => that._update());
      window.i18next.on("languageChanged", () => that._update());

      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "attributes") {
            that._update();
          }
        });
      }).observe(this, {attributes: true});
    }

    _update() {
      if (this._isAttached) {
        const options = this._getOptions();
        console.log(`i18next.t(${this.key}, ${JSON.stringify(options)})`);
        this._setVar(window.i18next.t(this.key, options));
      }
    }

    _getOptions() {
      const options = this._getParameters();
      if (this.notEscape) {
        options.interpolation = {escape: false};
      }
      return options;
    }

    _getParameters() {
      const parameters = {};
      Array.from(this.attributes)
        .filter((attr) => attr.name.startsWith("p-"))
        .forEach((attr) => {
          let value;
          try {
            value = JSON.parse(attr.value);
          } catch (e) {
            value = attr.value;
          }
          parameters[attr.name.substr(2)] = value;
        });
      return parameters;
    }

    _updateDom(value) {
      if (this.show) {
        this.innerHTML = value;
      }
    }
  }

  Polymer(KwcI18next);
})();