module.exports = {
  "extends": [
    "stylelint-config-standard",
    "stylelint-a11y/recommended",
    "stylelint-config-prettier",
    "stylelint-config-idiomatic-order",
  ],
  "plugins": [
    "stylelint-order",
    "stylelint-no-unsupported-browser-features"
  ],
  "rules": {
    "plugin/no-unsupported-browser-features": [
      true,
      {
        "severity": "warning"
      }
    ],
    "color-hex-length": "long",
    "selector-pseudo-element-colon-notation": "single",
    "property-no-vendor-prefix": true,
    "max-empty-lines": [
      2,
      {
        "ignore": [
          "comments"
        ]
      }
    ],
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
  }
}
