module.exports = {
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-idiomatic-order",
  ],
  "plugins": [
    "stylelint-order",
    "stylelint-no-unsupported-browser-features",
  ],
  "rules": {
    "plugin/no-unsupported-browser-features": [
      true,
      {
        "severity": "warning"
      }
    ],
    "declaration-block-no-redundant-longhand-properties": null,
    "selector-class-pattern": null,
    "keyframes-name-pattern": null,

    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    "color-hex-length": "long",
    "selector-pseudo-element-colon-notation": "single",
    "property-no-vendor-prefix": true,
    "rule-empty-line-before": [
      "always-multi-line",
      {
        "except": [
          "after-single-line-comment",
          "first-nested"
        ]
      }
    ],
    // vvv remove later to make codebase better vvv
    "no-descending-specificity": null,
    "custom-property-pattern": null,
    "font-family-no-missing-generic-family-keyword": null,
    "property-no-unknown": null,
    "scss/at-extend-no-missing-placeholder": null,
    "scss/dollar-variable-pattern": null,
    "scss/load-no-partial-leading-underscore": null,
    "scss/no-global-function-names": null,
    "scss/operator-no-unspaced": null,
    "selector-pseudo-class-no-unknown": [true, { "ignorePseudoClasses": ["global", "local", "input-placeholder"] }],
    "selector-pseudo-element-no-unknown": [true, { "ignorePseudoElements": ["input-placeholder"] }],
  }
}
