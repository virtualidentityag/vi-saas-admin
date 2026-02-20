module.exports = {
  "customSyntax": "postcss-scss",
  "extends": [
    "stylelint-config-standard",
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

    // Disabled: allow SASS @import syntax
    "import-notation": null,
    // Disabled: allow rgba() and legacy color functions in existing code
    "color-function-notation": null,
    "color-function-alias-notation": null,
    "alpha-value-notation": null,
    // Disabled: allow CSS Modules :global and :local selectors
    "selector-pseudo-class-no-unknown": null,
    // Disabled: allow legacy media query range syntax
    "media-feature-range-notation": null,
    // Disabled: SCSS variables in media queries are valid SCSS but not valid CSS
    "media-query-no-invalid": null,
    // Disabled: SCSS variables in @font-face descriptors are valid SCSS but not valid CSS
    "at-rule-descriptor-value-no-unknown": null,
    // Disabled: // comments are valid SCSS but not valid CSS
    "no-invalid-double-slash-comments": null,
    // Disabled: SCSS variables may appear as property values
    "property-no-unknown": null,
    "declaration-property-value-no-unknown": null,

    // vvv remove later to make codebase better vvv
    "no-descending-specificity": null,
  }
}
