function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function precomputeFeatureValue(feature, sizeFeatures) {
  const width = sizeFeatures.width;
  const height = sizeFeatures.height;
  const inlineSize = sizeFeatures.inlineSize;
  const blockSize = sizeFeatures.blockSize;

  switch (feature) {
    case 1
    /* Width */
    :
      return width != null ? {
        type: 3
        /* Dimension */
        ,
        value: width,
        unit: 'px'
      } : {
        type: 1
        /* Unknown */

      };

    case 3
    /* InlineSize */
    :
      return inlineSize != null ? {
        type: 3
        /* Dimension */
        ,
        value: inlineSize,
        unit: 'px'
      } : {
        type: 1
        /* Unknown */

      };

    case 2
    /* Height */
    :
      return height != null ? {
        type: 3
        /* Dimension */
        ,
        value: height,
        unit: 'px'
      } : {
        type: 1
        /* Unknown */

      };

    case 4
    /* BlockSize */
    :
      return blockSize != null ? {
        type: 3
        /* Dimension */
        ,
        value: blockSize,
        unit: 'px'
      } : {
        type: 1
        /* Unknown */

      };

    case 5
    /* AspectRatio */
    :
      return width != null && height != null && height > 0 ? {
        type: 2
        /* Number */
        ,
        value: width / height
      } : {
        type: 1
        /* Unknown */

      };

    case 6
    /* Orientation */
    :
      return width != null && height != null ? {
        type: 4
        /* Orientation */
        ,
        value: height >= width ? 'portrait' : 'landscape'
      } : {
        type: 1
        /* Unknown */

      };
  }
}

function evaluateExpressionToValue(node, context) {
  switch (node.type) {
    case 1
    /* Negate */
    :
    case 2
    /* Conjunction */
    :
    case 3
    /* Disjunction */
    :
    case 4
    /* Comparison */
    :
      return evaluateExpressionToBoolean(node, context);

    case 5
    /* Feature */
    :
      {
        const value = context.sizeFeatures.get(node.feature);
        return value == null ? {
          type: 1
          /* Unknown */

        } : value;
      }

    case 6
    /* Value */
    :
      return node.value;
  }
}

function toBooleanValue(value) {
  return {
    type: 5
    /* Boolean */
    ,
    value
  };
}

function compareNumericValueInternal(lhs, rhs, operator) {
  switch (operator) {
    case 1
    /* EQUAL */
    :
      return lhs === rhs;

    case 2
    /* GREATER_THAN */
    :
      return lhs > rhs;

    case 3
    /* GREATER_THAN_EQUAL */
    :
      return lhs >= rhs;

    case 4
    /* LESS_THAN */
    :
      return lhs < rhs;

    case 5
    /* LESS_THAN_EQUAL */
    :
      return lhs <= rhs;
  }
}

function compareNumericValue(lhs, rhs, operator) {
  return toBooleanValue(compareNumericValueInternal(lhs, rhs, operator));
}

function transformNullableNumbers(lhs, rhs, transform) {
  if (lhs == null) {
    return rhs;
  } else if (rhs == null) {
    return lhs;
  } else {
    return transform(lhs, rhs);
  }
}

function getContainerRelativeLengthScale(unit, treeContext) {
  switch (unit) {
    case 'cqw':
      return treeContext.cqw;

    case 'cqh':
      return treeContext.cqh;

    case 'cqi':
      return treeContext.writingAxis === 0
      /* Horizontal */
      ? treeContext.cqw : treeContext.cqh;

    case 'cqb':
      return treeContext.writingAxis === 1
      /* Vertical */
      ? treeContext.cqw : treeContext.cqh;

    case 'cqmin':
      return transformNullableNumbers(getContainerRelativeLengthScale('cqi', treeContext), getContainerRelativeLengthScale('cqb', treeContext), Math.min);

    case 'cqmax':
      return transformNullableNumbers(getContainerRelativeLengthScale('cqi', treeContext), getContainerRelativeLengthScale('cqb', treeContext), Math.max);
  }
}

function evaluateDimensionToPixels(dimension, {
  treeContext
}) {
  switch (dimension.unit) {
    case 'px':
      return dimension.value;

    case 'rem':
      return dimension.value * treeContext.rootFontSize;

    case 'em':
      return dimension.value * treeContext.fontSize;

    case 'cqw':
    case 'cqh':
    case 'cqi':
    case 'cqb':
    case 'cqmin':
    case 'cqmax':
      return transformNullableNumbers(dimension.value, getContainerRelativeLengthScale(dimension.unit, treeContext), (lhs, rhs) => lhs * rhs);
  }

  return null;
}

function coerceToPixelDimension(value, context) {
  switch (value.type) {
    case 2
    /* Number */
    :
      // https://drafts.csswg.org/css-values-4/#lengths
      return value.value === 0 ? 0 : null;

    case 3
    /* Dimension */
    :
      return evaluateDimensionToPixels(value, context);
  }

  return null;
}

function compareValues(lhs, rhs, operator) {
  return operator === 1
  /* EQUAL */
  ? toBooleanValue(lhs.value === rhs.value) : {
    type: 1
    /* Unknown */

  };
}

function evaluateComparisonExpression(node, context) {
  const left = evaluateExpressionToValue(node.left, context);
  const right = evaluateExpressionToValue(node.right, context);
  const operator = node.operator;

  if (left.type === 4
  /* Orientation */
  && right.type === 4
  /* Orientation */
  || left.type === 5
  /* Boolean */
  && right.type === 5
  /* Boolean */
  ) {
    return compareValues(left, right, operator);
  } else if (left.type === 3
  /* Dimension */
  || right.type === 3
  /* Dimension */
  ) {
    const lhs = coerceToPixelDimension(left, context);
    const rhs = coerceToPixelDimension(right, context);

    if (lhs != null && rhs != null) {
      return compareNumericValue(lhs, rhs, operator);
    }
  } else if (left.type === 2
  /* Number */
  && right.type === 2
  /* Number */
  ) {
    return compareNumericValue(left.value, right.value, operator);
  }

  return {
    type: 1
    /* Unknown */

  };
}

function evaluateConjunctionExpression(node, context) {
  const left = evaluateExpressionToBoolean(node.left, context);
  return !(left.type === 5
  /* Boolean */
  && left.value === true) ? left : evaluateExpressionToBoolean(node.right, context);
}

function evaluateDisjunctionExpression(node, context) {
  const left = evaluateExpressionToBoolean(node.left, context);
  return left.type === 5
  /* Boolean */
  && left.value === true ? left : evaluateExpressionToBoolean(node.right, context);
}

function evaluateExpressionToBoolean(node, context) {
  switch (node.type) {
    case 4
    /* Comparison */
    :
      return evaluateComparisonExpression(node, context);

    case 2
    /* Conjunction */
    :
      return evaluateConjunctionExpression(node, context);

    case 3
    /* Disjunction */
    :
      return evaluateDisjunctionExpression(node, context);

    case 1
    /* Negate */
    :
      {
        const result = evaluateExpressionToBoolean(node.value, context);
        return result.type === 5
        /* Boolean */
        ? {
          type: 5
          /* Boolean */
          ,
          value: !result.value
        } : {
          type: 1
          /* Unknown */

        };
      }

    case 5
    /* Feature */
    :
      return evaluateValueToBoolean(evaluateExpressionToValue(node, context));

    case 6
    /* Value */
    :
      return evaluateValueToBoolean(node.value);
  }
}

function evaluateValueToBoolean(value) {
  switch (value.type) {
    case 5
    /* Boolean */
    :
      return value;

    case 2
    /* Number */
    :
    case 3
    /* Dimension */
    :
      return {
        type: 5
        /* Boolean */
        ,
        value: value.value > 0
      };
  }

  return {
    type: 1
    /* Unknown */

  };
}

function evaluateContainerCondition(rule, context) {
  const sizeFeatures = new Map();
  const sizeFeatureValues = context.sizeFeatures;

  for (const feature of rule.features) {
    const value = precomputeFeatureValue(feature, sizeFeatureValues);

    if (value.type === 1
    /* Unknown */
    ) {
      return null;
    }

    sizeFeatures.set(feature, value);
  }

  const result = evaluateExpressionToBoolean(rule.condition, {
    sizeFeatures,
    treeContext: context.treeContext
  });
  return result.type === 5
  /* Boolean */
  ? result.value : null;
}

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const PER_RUN_UID = Array.from({
  length: 4
}, () => Math.floor(Math.random() * 256).toString(16)).join('');
const INTERNAL_KEYWORD_PREFIX = 'cq-';
const CUSTOM_PROPERTY_SHORTHAND = getCustomVariableName('container');
const CUSTOM_PROPERTY_TYPE = getCustomVariableName('container-type');
const CUSTOM_PROPERTY_NAME = getCustomVariableName('container-name');
const DATA_ATTRIBUTE_SELF = `data-cqs-${PER_RUN_UID}`;
const DATA_ATTRIBUTE_CHILD = `data-cqc-${PER_RUN_UID}`;
const CUSTOM_UNIT_VARIABLE_CQW = getCustomVariableName('cqw');
const CUSTOM_UNIT_VARIABLE_CQH = getCustomVariableName('cqh');
const CUSTOM_UNIT_VARIABLE_CQI = getCustomVariableName('cqi');
const CUSTOM_UNIT_VARIABLE_CQB = getCustomVariableName('cqb');

function getCustomVariableName(name) {
  return `--cq-${name}-${PER_RUN_UID}`;
}

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const PARSE_ERROR = Symbol();

function createParser(nodes, sentinel) {
  const parser = {
    value: sentinel,
    errorIndices: [],
    index: -1,

    at(offset) {
      const index = parser.index + offset;
      return index >= nodes.length ? sentinel : nodes[index];
    },

    consume(count) {
      parser.index += count;
      parser.value = parser.at(0);
      return parser.value;
    },

    reconsume() {
      parser.index -= 1;
    },

    error() {
      parser.errorIndices.push(parser.index);
    }

  };
  return parser;
}

function createNodeParser(nodes) {
  return createParser(nodes, {
    type: 0
    /* EOFToken */

  });
}
/**
 * Returns a stream of tokens according to CSS Syntax Module Level 3
 * (https://www.w3.org/TR/css-syntax-3/)
 */

function* tokenize(source) {
  const codePoints = [];
  let prevCarriageReturn = false;

  for (const chr of source) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const code = chr.codePointAt(0);

    if (prevCarriageReturn && code !== 10
    /* NEWLINE */
    ) {
      prevCarriageReturn = false;
      codePoints.push(10
      /* NEWLINE */
      );
    }

    if (code === 0 || code >= 55296
    /* SURROGATE_START */
    && code <= 57343
    /* SURROGATE_END */
    ) {
      codePoints.push(65533
      /* REPLACEMENT_CHARACTER */
      );
    } else if (code === 13
    /* CARRIAGE_RETURN */
    ) {
      prevCarriageReturn = true;
    } else {
      codePoints.push(code);
    }
  }

  const parser = createParser(codePoints, -1
  /* EOF */
  );
  const {
    at,
    consume,
    error,
    reconsume
  } = parser;

  function getCurrentString() {
    return String.fromCodePoint(parser.value);
  }

  function consumeDelimToken() {
    return {
      type: 13
      /* DelimToken */
      ,
      value: getCurrentString()
    };
  }

  function consumeHashToken() {
    return {
      type: 14
      /* HashToken */
      ,
      flag: isIdentSequence(at(1), at(2), at(3)) ? 1
      /* ID */
      : 0
      /* UNRESTRICTED */
      ,
      value: consumeIdentSequence()
    };
  } // § 4.3.2. Consume whitespace


  function consumeWhitespace() {
    while (isWhitespace(at(1))) {
      consume(1);
    }
  } // § 4.3.2. Consume comments


  function consumeComments() {
    while (parser.value !== -1
    /* EOF */
    ) {
      consume(1);

      if (at(0) === 42
      /* ASTERISK */
      && at(1) === 47
      /* SOLIDUS */
      ) {
        consume(1);
        return;
      }
    }

    error();
  } // § 4.3.3. Consume a numeric token


  function consumeNumericToken() {
    const [number, flag] = consumeNumber();
    const c1 = at(1);

    if (isIdentSequence(c1, at(1), at(2))) {
      const unit = consumeIdentSequence();
      return {
        type: 15
        /* DimensionToken */
        ,
        value: number,
        flag: flag,
        unit: unit
      };
    } else if (c1 === 37
    /* PERCENTAGE_SIGN */
    ) {
      consume(1);
      return {
        type: 16
        /* PercentageToken */
        ,
        value: number
      };
    } else {
      return {
        type: 17
        /* NumberToken */
        ,
        value: number,
        flag: flag
      };
    }
  } // § 4.3.4. Consume an ident-like token


  function consumeIdentLikeToken() {
    const value = consumeIdentSequence();
    let c1 = at(1);

    if (value.toLowerCase() === 'url' && c1 === 40
    /* LEFT_PARENTHESIS */
    ) {
      consume(1);

      while (isWhitespace(at(1)) && isWhitespace(at(2))) {
        consume(1);
      }

      c1 = at(1);
      const c2 = at(2);

      if (c1 === 34
      /* QUOTATION_MARK */
      || c1 === 39
      /* APOSTROPHE */
      ) {
        return {
          type: 23
          /* FunctionToken */
          ,
          value: value
        };
      } else if (isWhitespace(c1) && (c2 === 34
      /* QUOTATION_MARK */
      || c2 === 39
      /* APOSTROPHE */
      )) {
        return {
          type: 23
          /* FunctionToken */
          ,
          value: value
        };
      } else {
        return consumeUrlToken();
      }
    } else if (c1 === 40
    /* LEFT_PARENTHESIS */
    ) {
      consume(1);
      return {
        type: 23
        /* FunctionToken */
        ,
        value: value
      };
    } else {
      return {
        type: 24
        /* IdentToken */
        ,
        value: value
      };
    }
  } // § 4.3.5. Consume a string token


  function consumeStringToken(endCodePoint) {
    let value = ''; // eslint-disable-next-line no-constant-condition

    while (true) {
      const code = consume(1);

      if (code === -1
      /* EOF */
      || code === endCodePoint) {
        if (code === -1
        /* EOF */
        ) {
          error();
        }

        return {
          type: 2
          /* StringToken */
          ,
          value: value
        };
      } else if (isNewline(code)) {
        error();
        reconsume();
        return {
          type: 3
          /* BadStringToken */

        };
      } else if (code === 92
      /* REVERSE_SOLIDUS */
      ) {
        const nextCode = at(1);

        if (nextCode === -1
        /* EOF */
        ) {
          continue;
        } else if (isNewline(nextCode)) {
          consume(1);
        } else {
          value += consumeEscapedCodePoint();
        }
      } else {
        value += getCurrentString();
      }
    }
  } // § 4.3.6. Consume a url token


  function consumeUrlToken() {
    let value = '';
    consumeWhitespace(); // eslint-disable-next-line no-constant-condition

    while (true) {
      const code = consume(1);

      if (code === 41
      /* RIGHT_PARENTHESIS */
      ) {
        return {
          type: 20
          /* URLToken */
          ,
          value: value
        };
      } else if (code === -1
      /* EOF */
      ) {
        error();
        return {
          type: 20
          /* URLToken */
          ,
          value: value
        };
      } else if (isWhitespace(code)) {
        consumeWhitespace();
        const c1 = at(1);

        if (c1 === 41
        /* RIGHT_PARENTHESIS */
        || c1 === -1
        /* EOF */
        ) {
          consume(1);

          if (code === -1
          /* EOF */
          ) {
            error();
          }

          return {
            type: 20
            /* URLToken */
            ,
            value: value
          };
        } else {
          consumeBadUrl();
          return {
            type: 21
            /* BadURLToken */

          };
        }
      } else if (code === 34
      /* QUOTATION_MARK */
      || code === 39
      /* APOSTROPHE */
      || code === 40
      /* LEFT_PARENTHESIS */
      || isNonPrintable(code)) {
        error();
        consumeBadUrl();
        return {
          type: 21
          /* BadURLToken */

        };
      } else if (code === 92
      /* REVERSE_SOLIDUS */
      ) {
        if (isValidEscape(code, at(1))) {
          value += consumeEscapedCodePoint();
        } else {
          error();
          return {
            type: 21
            /* BadURLToken */

          };
        }
      } else {
        value += getCurrentString();
      }
    }
  } // § 4.3.7. Consume an escaped code point


  function consumeEscapedCodePoint() {
    const code = consume(1);

    if (isHexDigit(code)) {
      const hexDigits = [code];

      for (let i = 0; i < 5; i++) {
        const _code = at(1);

        if (!isHexDigit(_code)) {
          break;
        }

        hexDigits.push(_code);
        consume(1);
      }

      if (isWhitespace(at(1))) {
        consume(1);
      }

      let escapedCode = parseInt(String.fromCodePoint(...hexDigits), 16);

      if (escapedCode === 0 || escapedCode >= 55296
      /* SURROGATE_START */
      && escapedCode <= 57343
      /* SURROGATE_END */
      || escapedCode > 1114111
      /* MAX */
      ) {
        escapedCode = 65533
        /* REPLACEMENT_CHARACTER */
        ;
      }

      return String.fromCodePoint(escapedCode);
    } else if (code === -1
    /* EOF */
    ) {
      error();
      return String.fromCodePoint(65533
      /* REPLACEMENT_CHARACTER */
      );
    } else {
      return getCurrentString();
    }
  } // § 4.3.9. Check if three code points would start an ident sequence


  function isIdentSequence(c1, c2, c3) {
    if (c1 === 45
    /* HYPHEN_MINUS */
    ) {
      return isIdentStart(c2) || c2 === 45
      /* HYPHEN_MINUS */
      || isValidEscape(c2, c3);
    } else if (isIdentStart(c1)) {
      return true;
    } else {
      return false;
    }
  } // § 4.3.10. Check if three code points would start a number


  function isNumberStart(c1, c2, c3) {
    if (c1 === 43
    /* PLUS_SIGN */
    || c1 === 45
    /* HYPHEN_MINUS */
    ) {
      return isDigit(c2) || c2 === 46
      /* FULL_STOP */
      && isDigit(c3);
    } else if (c1 === 46
    /* FULL_STOP */
    && isDigit(c2)) {
      return true;
    } else if (isDigit(c1)) {
      return true;
    } else {
      return false;
    }
  } // § 4.3.11. Consume an ident sequence


  function consumeIdentSequence() {
    let value = ''; // eslint-disable-next-line no-constant-condition

    while (true) {
      const code = consume(1);

      if (isIdent(code)) {
        value += getCurrentString();
      } else if (isValidEscape(code, at(1))) {
        value += consumeEscapedCodePoint();
      } else {
        reconsume();
        return value;
      }
    }
  } // § 4.3.12. Consume a number


  function consumeNumber() {
    let type = 0
    /* INTEGER */
    ;
    let value = '';
    let c1 = at(1);

    if (c1 === 43
    /* PLUS_SIGN */
    || c1 === 45
    /* HYPHEN_MINUS */
    ) {
      consume(1);
      value += getCurrentString();
    }

    while (isDigit(at(1))) {
      consume(1);
      value += getCurrentString();
    }

    if (at(1) === 46
    /* FULL_STOP */
    && isDigit(at(2))) {
      type = 1
      /* NUMBER */
      ;
      consume(1);
      value += getCurrentString();

      while (isDigit(at(1))) {
        consume(1);
        value += getCurrentString();
      }
    }

    c1 = at(1);

    if (c1 === 69
    /* LATIN_CAPITAL_LETTER_E */
    || c1 === 101
    /* LATIN_SMALL_LETTER_E */
    ) {
      const c2 = at(2);

      if (isDigit(c2)) {
        type = 1
        /* NUMBER */
        ;
        consume(1);
        value += getCurrentString();

        while (isDigit(at(1))) {
          consume(1);
          value += getCurrentString();
        }
      } else if (c2 === 45
      /* HYPHEN_MINUS */
      || c2 === 43
      /* PLUS_SIGN */
      ) {
        if (isDigit(at(3))) {
          type = 1
          /* NUMBER */
          ;
          consume(1);
          value += getCurrentString();
          consume(1);
          value += getCurrentString();

          while (isDigit(at(1))) {
            consume(1);
            value += getCurrentString();
          }
        }
      }
    }

    return [value, type];
  } // 4.3.14. Consume the remnants of a bad url


  function consumeBadUrl() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const code = consume(1);

      if (code === -1
      /* EOF */
      ) {
        return;
      } else if (isValidEscape(code, at(1))) {
        consumeEscapedCodePoint();
      }
    }
  }

  while (true) {
    const code = consume(1);

    if (code === 47
    /* SOLIDUS */
    && at(1) === 42
    /* ASTERISK */
    ) {
      consume(2);
      consumeComments();
    } else if (isWhitespace(code)) {
      consumeWhitespace();
      yield {
        type: 1
        /* WhitespaceToken */

      };
    } else if (code === 34
    /* QUOTATION_MARK */
    ) {
      yield consumeStringToken(code);
    } else if (code === 35
    /* NUMBER_SIGN */
    ) {
      const c1 = at(1);

      if (isIdent(c1) || isValidEscape(c1, at(2))) {
        yield consumeHashToken();
      } else {
        yield consumeDelimToken();
      }
    } else if (code === 39
    /* APOSTROPHE */
    ) {
      yield consumeStringToken(code);
    } else if (code === 40
    /* LEFT_PARENTHESIS */
    ) {
      yield {
        type: 4
        /* LeftParenthesisToken */

      };
    } else if (code === 41
    /* RIGHT_PARENTHESIS */
    ) {
      yield {
        type: 5
        /* RightParenthesisToken */

      };
    } else if (code === 43
    /* PLUS_SIGN */
    ) {
      if (isNumberStart(code, at(1), at(2))) {
        reconsume();
        yield consumeNumericToken();
      } else {
        yield consumeDelimToken();
      }
    } else if (code === 44
    /* COMMA */
    ) {
      yield {
        type: 6
        /* CommaToken */

      };
    } else if (code === 45
    /* HYPHEN_MINUS */
    ) {
      const c1 = at(1);
      const c2 = at(2);

      if (isNumberStart(code, c1, c2)) {
        reconsume();
        yield consumeNumericToken();
      } else if (c1 === 45
      /* HYPHEN_MINUS */
      && c2 === 62
      /* GREATER_THAN_SIGN */
      ) {
        consume(2);
        yield {
          type: 19
          /* CDCToken */

        };
      } else if (isIdentSequence(code, c1, c2)) {
        reconsume();
        yield consumeIdentLikeToken();
      } else {
        yield consumeDelimToken();
      }
    } else if (code === 46
    /* FULL_STOP */
    ) {
      if (isNumberStart(code, at(1), at(2))) {
        reconsume();
        yield consumeNumericToken();
      } else {
        yield consumeDelimToken();
      }
    } else if (code === 58
    /* COLON */
    ) {
      yield {
        type: 7
        /* ColonToken */

      };
    } else if (code === 59
    /* SEMICOLON */
    ) {
      yield {
        type: 8
        /* SemicolonToken */

      };
    } else if (code === 60
    /* LESS_THAN_SIGN */
    ) {
      if (at(1) === 33
      /* EXCLAMATION_MARK */
      && at(2) === 45
      /* HYPHEN_MINUS */
      && at(3) === 45
      /* HYPHEN_MINUS */
      ) {
        yield {
          type: 18
          /* CDOToken */

        };
      } else {
        yield consumeDelimToken();
      }
    } else if (code === 64
    /* COMMERCIAL_AT */
    ) {
      if (isIdentSequence(at(1), at(2), at(3))) {
        const value = consumeIdentSequence();
        yield {
          type: 22
          /* AtKeywordToken */
          ,
          value: value
        };
      } else {
        yield consumeDelimToken();
      }
    } else if (code === 91
    /* LEFT_SQUARE_BRACKET */
    ) {
      yield {
        type: 9
        /* LeftSquareBracketToken */

      };
    } else if (code === 92
    /* REVERSE_SOLIDUS */
    ) {
      if (isValidEscape(code, at(1))) {
        reconsume();
        yield consumeIdentLikeToken();
      } else {
        error();
        yield consumeDelimToken();
      }
    } else if (code === 93
    /* RIGHT_SQUARE_BRACKET */
    ) {
      yield {
        type: 10
        /* RightSquareBracketToken */

      };
    } else if (code === 123
    /* LEFT_CURLY_BRACKET */
    ) {
      yield {
        type: 11
        /* LeftCurlyBracketToken */

      };
    } else if (code === 125
    /* RIGHT_CURLY_BRACKET */
    ) {
      yield {
        type: 12
        /* RightCurlyBracketToken */

      };
    } else if (isDigit(code)) {
      reconsume();
      yield consumeNumericToken();
    } else if (isIdentStart(code)) {
      reconsume();
      yield consumeIdentLikeToken();
    } else if (code === -1
    /* EOF */
    ) {
      yield {
        type: 0
        /* EOFToken */

      };
      return parser.errorIndices;
    } else {
      yield {
        type: 13
        /* DelimToken */
        ,
        value: getCurrentString()
      };
    }
  }
}

function isDigit(c) {
  return c >= 48
  /* DIGIT_ZERO */
  && c <= 57
  /* DIGIT_NINE */
  ;
}

function isHexDigit(c) {
  return isDigit(c) || c >= 65
  /* LATIN_CAPITAL_LETTER_A */
  && c <= 70
  /* LATIN_CAPITAL_LETTER_F */
  || c >= 97
  /* LATIN_SMALL_LETTER_A */
  && c <= 102
  /* LATIN_SMALL_LETTER_F */
  ;
}

function isNewline(c) {
  return c === 10
  /* NEWLINE */
  || c === 13
  /* CARRIAGE_RETURN */
  || c === 12
  /* FORM_FEED */
  ;
}

function isWhitespace(c) {
  return isNewline(c) || c === 9
  /* CHARACTER_TABULATION */
  || c === 32
  /* SPACE */
  ;
}

function isIdentStart(c) {
  return c >= 65
  /* LATIN_CAPITAL_LETTER_A */
  && c <= 90
  /* LATIN_CAPITAL_LETTER_Z */
  || c >= 97
  /* LATIN_SMALL_LETTER_A */
  && c <= 122
  /* LATIN_SMALL_LETTER_Z */
  || c >= 128
  /* CONTROL */
  || c === 95
  /* LOW_LINE */
  ;
}

function isValidEscape(c1, c2) {
  if (c1 !== 92
  /* REVERSE_SOLIDUS */
  ) {
    return false;
  } else if (isNewline(c2)) {
    return false;
  } else {
    return true;
  }
}

function isIdent(c) {
  return isIdentStart(c) || isDigit(c) || c === 45
  /* HYPHEN_MINUS */
  ;
}

function isNonPrintable(c) {
  return c >= 0
  /* NULL */
  && c <= 8
  /* BACKSPACE */
  || c === 11
  /* LINE_TABULATION */
  || c >= 14
  /* SHIFT_OUT */
  && c <= 31
  /* INFORMATION_SEPARATOR_ONE */
  || c === 127
  /* DELETE */
  ;
}

const ENDING_TOKEN_MAP = {
  [11
  /* LeftCurlyBracketToken */
  ]: 12
  /* RightCurlyBracketToken */
  ,
  [9
  /* LeftSquareBracketToken */
  ]: 10
  /* RightSquareBracketToken */
  ,
  [4
  /* LeftParenthesisToken */
  ]: 5
  /* RightParenthesisToken */

}; // § 5.3.3. Parse a stylesheet

function parseStylesheet(nodes, topLevel) {
  const node = consumeRuleList(createNodeParser(nodes), topLevel === true);
  return _extends({}, node, {
    value: node.value.map(rule => {
      return rule.type === 26
      /* QualifiedRuleNode */
      ? reinterpretQualifiedRule(rule, parseStyleBlock) : rule;
    })
  });
}
function parseComponentValue(nodes) {
  const parser = createNodeParser(nodes);
  const result = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    const node = parser.consume(1);

    switch (node.type) {
      case 0
      /* EOFToken */
      :
        return result;

      default:
        parser.reconsume();
        result.push(consumeComponentValue(parser));
        break;
    }
  }
}

function reinterpretQualifiedRule(node, callback) {
  if (node.value.value.type === 0
  /* SimpleBlock */
  ) {
    return _extends({}, node, {
      value: _extends({}, node.value, {
        value: callback(node.value.value.value)
      })
    });
  }

  return node;
} // § 5.3.6. Parse a declaration


function parseDeclaration(nodes) {
  const parser = createNodeParser(nodes);
  consumeWhitespace(parser);

  if (parser.at(1).type !== 24
  /* IdentToken */
  ) {
    return PARSE_ERROR;
  }

  const declaration = consumeDeclaration(parser);

  if (!declaration) {
    return PARSE_ERROR;
  }

  return declaration;
} // § 5.3.7. Parse a style block’s contents

function parseStyleBlock(nodes) {
  return consumeStyleBlock(createNodeParser(nodes));
} // § 5.3.8. Parse a list of declarations
function consumeWhitespace(parser) {
  while (parser.at(1).type === 1
  /* WhitespaceToken */
  ) {
    parser.consume(1);
  }
} // § 5.4.1. Consume a list of rules

function consumeRuleList(parser, topLevel) {
  const rules = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    const node = parser.consume(1);

    switch (node.type) {
      case 1
      /* WhitespaceToken */
      :
        // Do nothing.
        break;

      case 0
      /* EOFToken */
      :
        return {
          type: 3
          /* RuleList */
          ,
          value: rules
        };

      case 18
      /* CDOToken */
      :
      case 19
      /* CDCToken */
      :
        if (topLevel !== false) {
          parser.reconsume();
          const rule = consumeQualifiedRule(parser);

          if (rule !== PARSE_ERROR) {
            rules.push(rule);
          }
        }

        break;

      case 22
      /* AtKeywordToken */
      :
        parser.reconsume();
        rules.push(consumeAtRule(parser));
        break;

      default:
        {
          parser.reconsume();
          const rule = consumeQualifiedRule(parser);

          if (rule !== PARSE_ERROR) {
            rules.push(rule);
          }

          break;
        }
    }
  }
} // § 5.4.2. Consume an at-rule


function consumeAtRule(parser) {
  let node = parser.consume(1);

  if (node.type !== 22
  /* AtKeywordToken */
  ) {
    throw new Error(`Unexpected type ${node.type}`);
  }

  const name = node.value;
  const prelude = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    node = parser.consume(1);

    switch (node.type) {
      case 8
      /* SemicolonToken */
      :
        return {
          type: 25
          /* AtRuleNode */
          ,
          name,
          prelude,
          value: null
        };

      case 0
      /* EOFToken */
      :
        parser.error();
        return {
          type: 25
          /* AtRuleNode */
          ,
          name,
          prelude,
          value: null
        };

      case 11
      /* LeftCurlyBracketToken */
      :
        return {
          type: 25
          /* AtRuleNode */
          ,
          name,
          prelude,
          value: consumeSimpleBlock(parser)
        };

      case 28
      /* BlockNode */
      :
        if (node.source.type === 11
        /* LeftCurlyBracketToken */
        ) {
          return {
            type: 25
            /* AtRuleNode */
            ,
            name,
            prelude,
            value: node
          };
        }

      // eslint-disable-next-line no-fallthrough

      default:
        parser.reconsume();
        prelude.push(consumeComponentValue(parser));
        break;
    }
  }
} // § 5.4.3. Consume a qualified rule


function consumeQualifiedRule(parser) {
  let node = parser.value;
  const prelude = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    node = parser.consume(1);

    switch (node.type) {
      case 0
      /* EOFToken */
      :
        parser.error();
        return PARSE_ERROR;

      case 11
      /* LeftCurlyBracketToken */
      :
        return {
          type: 26
          /* QualifiedRuleNode */
          ,
          prelude,
          value: consumeSimpleBlock(parser)
        };

      case 28
      /* BlockNode */
      :
        if (node.source.type === 11
        /* LeftCurlyBracketToken */
        ) {
          return {
            type: 26
            /* QualifiedRuleNode */
            ,
            prelude,
            value: node
          };
        }

      // eslint-disable-next-line no-fallthrough

      default:
        parser.reconsume();
        prelude.push(consumeComponentValue(parser));
        break;
    }
  }
} // § 5.4.4. Consume a style block’s contents


function consumeStyleBlock(parser) {
  const rules = [];
  const declarations = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    const node = parser.consume(1);

    switch (node.type) {
      case 1
      /* WhitespaceToken */
      :
      case 8
      /* SemicolonToken */
      :
        // Do nothing
        break;

      case 0
      /* EOFToken */
      :
        return {
          type: 1
          /* StyleBlock */
          ,
          value: [...declarations, ...rules]
        };

      case 22
      /* AtKeywordToken */
      :
        parser.reconsume();
        rules.push(consumeAtRule(parser));
        break;

      case 24
      /* IdentToken */
      :
        {
          const temp = [node];
          let next = parser.at(1);

          while (next.type !== 8
          /* SemicolonToken */
          && next.type !== 0
          /* EOFToken */
          ) {
            temp.push(consumeComponentValue(parser));
            next = parser.at(1);
          }

          const declaration = consumeDeclaration(createNodeParser(temp));

          if (declaration !== PARSE_ERROR) {
            declarations.push(declaration);
          }

          break;
        }

      case 13
      /* DelimToken */
      :
        {
          if (node.value === '&') {
            parser.reconsume();
            const rule = consumeQualifiedRule(parser);

            if (rule !== PARSE_ERROR) {
              rules.push(rule);
            }

            break;
          }
        }
      // eslint-disable-next-line no-fallthrough

      default:
        {
          parser.error();
          parser.reconsume();
          let next = parser.at(1);

          while (next.type !== 8
          /* SemicolonToken */
          && next.type !== 0
          /* EOFToken */
          ) {
            consumeComponentValue(parser);
            next = parser.at(1);
          }

          break;
        }
    }
  }
} // § 5.4.5. Consume a list of declarations


function consumeDeclaration(parser) {
  const node = parser.consume(1);

  if (node.type !== 24
  /* IdentToken */
  ) {
    throw new Error(`Unexpected type ${node.type}`);
  }

  const name = node.value;
  const value = [];
  let important = false;
  consumeWhitespace(parser);

  if (parser.at(1).type !== 7
  /* ColonToken */
  ) {
    parser.error();
    return PARSE_ERROR;
  }

  parser.consume(1);
  consumeWhitespace(parser);

  while (parser.at(1).type !== 0
  /* EOFToken */
  ) {
    value.push(consumeComponentValue(parser));
  }

  const secondToLastValue = value[value.length - 2];
  const lastValue = value[value.length - 1];

  if (secondToLastValue && secondToLastValue.type === 13
  /* DelimToken */
  && secondToLastValue.value === '!' && lastValue.type === 24
  /* IdentToken */
  && lastValue.value.toLowerCase() === 'important') {
    important = true;
    value.splice(value.length - 2);
  }

  return {
    type: 29
    /* DeclarationNode */
    ,
    name,
    value,
    important
  };
} // § 5.4.7. Consume a component value


function consumeComponentValue(parser) {
  const node = parser.consume(1);

  switch (node.type) {
    case 11
    /* LeftCurlyBracketToken */
    :
    case 9
    /* LeftSquareBracketToken */
    :
    case 4
    /* LeftParenthesisToken */
    :
      return consumeSimpleBlock(parser);

    case 23
    /* FunctionToken */
    :
      return consumeFunction(parser);

    default:
      return node;
  }
} // § 5.4.8. Consume a simple block


function consumeSimpleBlock(parser) {
  let node = parser.value;
  const source = node;
  const endToken = ENDING_TOKEN_MAP[source.type];

  if (!endToken) {
    throw new Error(`Unexpected type ${node.type}`);
  }

  const value = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    node = parser.consume(1);

    switch (node.type) {
      case endToken:
        return {
          type: 28
          /* BlockNode */
          ,
          source,
          value: {
            type: 0
            /* SimpleBlock */
            ,
            value
          }
        };

      case 0
      /* EOFToken */
      :
        parser.error();
        return {
          type: 28
          /* BlockNode */
          ,
          source,
          value: {
            type: 0
            /* SimpleBlock */
            ,
            value
          }
        };

      default:
        parser.reconsume();
        value.push(consumeComponentValue(parser));
        break;
    }
  }
} // § 5.4.9. Consume a function


function consumeFunction(parser) {
  let node = parser.value;

  if (node.type !== 23
  /* FunctionToken */
  ) {
    throw new Error(`Unexpected type ${node.type}`);
  }

  const name = node.value;
  const value = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    node = parser.consume(1);

    switch (node.type) {
      case 5
      /* RightParenthesisToken */
      :
        return {
          type: 27
          /* FunctionNode */
          ,
          name,
          value
        };

      case 0
      /* EOFToken */
      :
        parser.error();
        return {
          type: 27
          /* FunctionNode */
          ,
          name,
          value
        };

      default:
        parser.reconsume();
        value.push(consumeComponentValue(parser));
        break;
    }
  }
}

function isEOF(parser) {
  consumeWhitespace(parser);
  return parser.at(1).type === 0
  /* EOFToken */
  ;
}
const BLOCK_MAP = {
  [11
  /* LeftCurlyBracketToken */
  ]: ['{', '}'],
  [9
  /* LeftSquareBracketToken */
  ]: ['[', ']'],
  [4
  /* LeftParenthesisToken */
  ]: ['(', ')']
};

function serializeInternal(node, level) {
  switch (node.type) {
    case 25
    /* AtRuleNode */
    :
      return `@${CSS.escape(node.name)} ${node.prelude.map(n => serializeInternal(n)).join('')}${node.value ? serializeInternal(node.value) : ';'}`;

    case 26
    /* QualifiedRuleNode */
    :
      return `${node.prelude.map(n => serializeInternal(n)).join('')}${serializeInternal(node.value)}`;

    case 28
    /* BlockNode */
    :
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [start, end] = BLOCK_MAP[node.source.type];
        return `${start}${serializeBlock(node.value)}${end}`;
      }

    case 27
    /* FunctionNode */
    :
      return `${CSS.escape(node.name)}(${node.value.map(n => serializeInternal(n)).join('')})`;

    case 29
    /* DeclarationNode */
    :
      return `${CSS.escape(node.name)}:${node.value.map(n => serializeInternal(n)).join('')}${node.important ? ' !important' : ''}`;

    case 1
    /* WhitespaceToken */
    :
      return ' ';

    case 8
    /* SemicolonToken */
    :
      return ';';

    case 7
    /* ColonToken */
    :
      return ':';

    case 14
    /* HashToken */
    :
      return '#' + CSS.escape(node.value);

    case 24
    /* IdentToken */
    :
      return CSS.escape(node.value);

    case 15
    /* DimensionToken */
    :
      return node.value + CSS.escape(node.unit);

    case 13
    /* DelimToken */
    :
      return node.value;

    case 17
    /* NumberToken */
    :
      return node.value;

    case 2
    /* StringToken */
    :
      return `"${CSS.escape(node.value)}"`;

    case 6
    /* CommaToken */
    :
      return ',';

    case 20
    /* URLToken */
    :
      return 'url(' + CSS.escape(node.value) + ')';

    case 22
    /* AtKeywordToken */
    :
      return '@' + CSS.escape(node.value);

    case 16
    /* PercentageToken */
    :
      return node.value + '%';

    default:
      throw new Error(`Unsupported token ${node.type}`);
  }
}

function serializeBlock(block, level) {
  return block.value.map(node => {
    let res = serializeInternal(node);

    if (node.type === 29
    /* DeclarationNode */
    && block.type !== 0
    /* SimpleBlock */
    ) {
      res += ';';
    }

    return res;
  }).join('');
}
function serialize(node) {
  return serializeInternal(node);
}

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function tryConsumeEqualsDelim(parser) {
  const next = parser.at(1);

  if (next.type !== 13
  /* DelimToken */
  || next.value !== "="
  /* EQUAL */
  ) {
    return false;
  }

  parser.consume(1);
  return true;
}

function consumeUntilOperatorDelim(parser, includeColon) {
  const nodes = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    const next = parser.at(1);

    if (next.type === 0
    /* EOFToken */
    || includeColon && next.type === 7
    /* ColonToken */
    || next.type === 13
    /* DelimToken */
    && (next.value === ">"
    /* GREATER_THAN */
    || next.value === "<"
    /* LESS_THAN */
    || next.value === "="
    /* EQUAL */
    )) {
      break;
    }

    nodes.push(parser.consume(1));
  }

  return nodes;
}

function consumeComparisonOperator(parser) {
  consumeWhitespace(parser);
  const node = parser.consume(1);

  if (node.type !== 13
  /* DelimToken */
  ) {
    return PARSE_ERROR;
  }

  if (node.value === ">"
  /* GREATER_THAN */
  ) {
    return tryConsumeEqualsDelim(parser) ? 3
    /* GREATER_THAN_EQUAL */
    : 2
    /* GREATER_THAN */
    ;
  } else if (node.value === "<"
  /* LESS_THAN */
  ) {
    return tryConsumeEqualsDelim(parser) ? 5
    /* LESS_THAN_EQUAL */
    : 4
    /* LESS_THAN */
    ;
  } else if (node.value === "="
  /* EQUAL */
  ) {
    return 1
    /* EQUAL */
    ;
  } else {
    return PARSE_ERROR;
  }
}

function isLessThan(operator) {
  return operator === 4
  /* LESS_THAN */
  || operator === 5
  /* LESS_THAN_EQUAL */
  ;
}

function isGreaterThan(operator) {
  return operator === 2
  /* GREATER_THAN */
  || operator === 3
  /* GREATER_THAN_EQUAL */
  ;
}

function consumeStandaloneIdent(parser) {
  consumeWhitespace(parser);
  const node = parser.consume(1);
  consumeWhitespace(parser);
  return node.type !== 24
  /* IdentToken */
  || parser.at(1).type !== 0
  /* EOFToken */
  ? PARSE_ERROR : node.value;
}

function tryGetFeatureName(chunk, features, transform) {
  const maybeIdent = consumeStandaloneIdent(createNodeParser(chunk));

  if (maybeIdent === PARSE_ERROR) {
    return PARSE_ERROR;
  }

  let feature = maybeIdent.toLowerCase();
  feature = transform ? transform(feature) : feature;
  return features.has(feature) ? feature : PARSE_ERROR;
}

function consumeMediaFeature(parser, features) {
  const firstChunk = consumeUntilOperatorDelim(parser, true);
  const next = parser.at(1);

  if (next.type === 0
  /* EOFToken */
  ) {
    const feature = tryGetFeatureName(firstChunk, features);
    return feature !== PARSE_ERROR && features.has(feature) ? {
      type: 1
      /* Boolean */
      ,
      feature
    } : PARSE_ERROR;
  } else if (next.type === 7
  /* ColonToken */
  ) {
    parser.consume(1);
    const value = consumeUntilOperatorDelim(parser, false);
    let operator = 1
    /* EQUAL */
    ;
    const feature = tryGetFeatureName(firstChunk, features, rawFeature => {
      if (rawFeature.startsWith('min-')) {
        operator = 3
        /* GREATER_THAN_EQUAL */
        ;
        return rawFeature.substring(4);
      } else if (rawFeature.startsWith('max-')) {
        operator = 5
        /* LESS_THAN_EQUAL */
        ;
        return rawFeature.substring(4);
      }

      return rawFeature;
    });
    return feature !== PARSE_ERROR ? {
      type: 2
      /* Range */
      ,
      feature,
      bounds: [null, [operator, value]]
    } : PARSE_ERROR;
  }

  const firstOperator = consumeComparisonOperator(parser);

  if (firstOperator === PARSE_ERROR) {
    return PARSE_ERROR;
  }

  const secondChunk = consumeUntilOperatorDelim(parser, false);

  if (parser.at(1).type === 0
  /* EOFToken */
  ) {
    const maybeFirstChunkFeature = tryGetFeatureName(firstChunk, features);

    if (maybeFirstChunkFeature !== PARSE_ERROR) {
      return {
        type: 2
        /* Range */
        ,
        feature: maybeFirstChunkFeature,
        bounds: [null, [firstOperator, secondChunk]]
      };
    }

    const maybeSecondChunkFeature = tryGetFeatureName(secondChunk, features);

    if (maybeSecondChunkFeature !== PARSE_ERROR) {
      return {
        type: 2
        /* Range */
        ,
        feature: maybeSecondChunkFeature,
        bounds: [[firstOperator, firstChunk], null]
      };
    }

    return PARSE_ERROR;
  }

  const secondOperator = consumeComparisonOperator(parser);

  if (secondOperator === PARSE_ERROR || !(isGreaterThan(firstOperator) && isGreaterThan(secondOperator) || isLessThan(firstOperator) && isLessThan(secondOperator))) {
    return PARSE_ERROR;
  }

  const thirdChunk = consumeUntilOperatorDelim(parser, false);
  const maybeFeature = tryGetFeatureName(secondChunk, features);
  return maybeFeature !== PARSE_ERROR ? {
    type: 2
    /* Range */
    ,
    feature: maybeFeature,
    bounds: [[firstOperator, firstChunk], [secondOperator, thirdChunk]]
  } : PARSE_ERROR;
}

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ws() {
  return {
    type: 1
    /* WhitespaceToken */

  };
}
function delim(value) {
  return {
    type: 13
    /* DelimToken */
    ,
    value
  };
}
function decl(name, value) {
  return {
    type: 29
    /* DeclarationNode */
    ,
    name,
    value,
    important: false
  };
}
function ident(value) {
  return {
    type: 24
    /* IdentToken */
    ,
    value
  };
}
function func(name, value) {
  return {
    type: 27
    /* FunctionNode */
    ,
    name,
    value
  };
}
function customVar(name) {
  return func('var', [ident(name)]);
}

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function parseQueryCondition(parser, andOr) {
  consumeWhitespace(parser);
  let negated = false;
  let next = parser.at(1);

  if (next.type === 24
  /* IdentToken */
  ) {
    if (next.value.toLowerCase() !== 'not') {
      return PARSE_ERROR;
    }

    parser.consume(1);
    consumeWhitespace(parser);
    negated = true;
  }

  let left = parseQueryInParens(parser);

  if (left === PARSE_ERROR) {
    return PARSE_ERROR;
  }

  left = negated ? {
    type: 1
    /* Negate */
    ,
    value: left
  } : left;
  consumeWhitespace(parser);
  next = parser.at(1);
  const nextAndOr = next.type === 24
  /* IdentToken */
  ? next.value.toLowerCase() : null;

  if (nextAndOr !== null) {
    parser.consume(1);
    consumeWhitespace(parser);

    if (nextAndOr !== 'and' && nextAndOr !== 'or' || andOr !== null && nextAndOr !== andOr) {
      return PARSE_ERROR;
    }

    const right = parseQueryCondition(parser, nextAndOr);

    if (right === PARSE_ERROR) {
      return PARSE_ERROR;
    }

    return {
      type: nextAndOr === 'and' ? 2
      /* Conjunction */
      : 3
      /* Disjunction */
      ,
      left,
      right
    };
  }

  return isEOF(parser) ? left : PARSE_ERROR;
}

function parseQueryInParens(parser) {
  const node = parser.consume(1);

  switch (node.type) {
    case 28
    /* BlockNode */
    :
      {
        if (node.source.type !== 4
        /* LeftParenthesisToken */
        ) {
          return PARSE_ERROR;
        }

        const maybeQueryCondition = parseQueryCondition(createNodeParser(node.value.value), null);

        if (maybeQueryCondition !== PARSE_ERROR) {
          return maybeQueryCondition;
        }

        return {
          type: 4
          /* Literal */
          ,
          value: node
        };
      }

    case 27
    /* FunctionNode */
    :
      return {
        type: 4
        /* Literal */
        ,
        value: node
      };

    default:
      return PARSE_ERROR;
  }
}

function consumeMediaCondition(parser) {
  return parseQueryCondition(parser, null);
}
function parseMediaCondition(nodes) {
  return consumeMediaCondition(createNodeParser(nodes));
}
function transformMediaConditionToTokens(node) {
  switch (node.type) {
    case 1
    /* Negate */
    :
      return [ident('not'), ws(), ...transformMediaConditionToTokens(node.value)];

    case 2
    /* Conjunction */
    :
    case 3
    /* Disjunction */
    :
      return [...transformMediaConditionToTokens(node.left), ws(), ident(node.type === 2
      /* Conjunction */
      ? 'and' : 'or'), ws(), ...transformMediaConditionToTokens(node.right)];

    case 4
    /* Literal */
    :
      return [node.value];
  }
}

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const SIZE_FEATURE_MAP = {
  width: 1
  /* Width */
  ,
  height: 2
  /* Height */
  ,
  'inline-size': 3
  /* InlineSize */
  ,
  'block-size': 4
  /* BlockSize */
  ,
  'aspect-ratio': 5
  /* AspectRatio */
  ,
  orientation: 6
  /* Orientation */

};
const FEATURE_NAMES = new Set(Object.keys(SIZE_FEATURE_MAP));
const CONTAINER_INVALID_NAMES = new Set(['none', 'and', 'not', 'or', 'normal', 'auto']);
const CONTAINER_STANDALONE_KEYWORD = new Set(['initial', 'inherit', 'revert', 'revert-layer', 'unset']);
const CONTAINER_TYPES = new Set(['size', 'inline-size']);

function consumeMaybeSeparatedByDelim(parser, delim, consumeA, consumeB) {
  const first = consumeA();

  if (first === PARSE_ERROR) {
    return PARSE_ERROR;
  }

  let res = [first, null];
  consumeWhitespace(parser);
  const next = parser.at(1);

  if (next.type === 13
  /* DelimToken */
  ) {
    if (next.value !== delim) {
      return PARSE_ERROR;
    }

    parser.consume(1);
    consumeWhitespace(parser);
    const second = consumeB();
    consumeWhitespace(parser);

    if (second !== PARSE_ERROR) {
      res = [first, second];
    }
  }

  return isEOF(parser) ? res : PARSE_ERROR;
}

function consumeNumber(parser) {
  const node = parser.consume(1);
  return node.type === 17
  /* NumberToken */
  ? parseInt(node.value) : PARSE_ERROR;
}

function consumeNumberOrRatio(parser) {
  const result = consumeMaybeSeparatedByDelim(parser, '/', () => consumeNumber(parser), () => consumeNumber(parser));

  if (result === PARSE_ERROR) {
    return PARSE_ERROR;
  }

  const numerator = result[0];
  const denominator = result[1] !== null ? result[1] : 1;
  return {
    type: 2
    /* Number */
    ,
    value: numerator / denominator
  };
}

function consumeValue(nodes) {
  const parser = createNodeParser(nodes);
  consumeWhitespace(parser);
  const node = parser.consume(1);
  let value = PARSE_ERROR;

  switch (node.type) {
    case 17
    /* NumberToken */
    :
      parser.reconsume();
      value = consumeNumberOrRatio(parser);
      break;

    case 15
    /* DimensionToken */
    :
      value = {
        type: 3
        /* Dimension */
        ,
        value: parseInt(node.value),
        unit: node.unit.toLowerCase()
      };
      break;

    case 24
    /* IdentToken */
    :
      {
        const ident = node.value.toLowerCase();

        switch (ident) {
          case 'landscape':
          case 'portrait':
            value = {
              type: 4
              /* Orientation */
              ,
              value: ident
            };
            break;
        }
      }
  }

  if (value === PARSE_ERROR) {
    return PARSE_ERROR;
  }

  return isEOF(parser) ? {
    type: 6
    /* Value */
    ,
    value
  } : PARSE_ERROR;
}

function parseSizeFeature(parser, context) {
  const mediaFeature = consumeMediaFeature(parser, FEATURE_NAMES);

  if (mediaFeature === PARSE_ERROR) {
    return PARSE_ERROR;
  }

  const feature = SIZE_FEATURE_MAP[mediaFeature.feature];

  if (feature == null) {
    return PARSE_ERROR;
  } // TODO: This is super wasteful, consider just using bits.


  context.features.add(feature);

  if (mediaFeature.type === 1
  /* Boolean */
  ) {
    return {
      type: 5
      /* Feature */
      ,
      feature
    };
  } else {
    const featureValue = {
      type: 5
      /* Feature */
      ,
      feature
    };
    let left = PARSE_ERROR;

    if (mediaFeature.bounds[0] !== null) {
      const value = consumeValue(mediaFeature.bounds[0][1]);

      if (value === PARSE_ERROR) {
        return PARSE_ERROR;
      }

      left = {
        type: 4
        /* Comparison */
        ,
        operator: mediaFeature.bounds[0][0],
        left: value,
        right: featureValue
      };
    }

    if (mediaFeature.bounds[1] !== null) {
      const value = consumeValue(mediaFeature.bounds[1][1]);

      if (value === PARSE_ERROR) {
        return PARSE_ERROR;
      }

      const right = {
        type: 4
        /* Comparison */
        ,
        operator: mediaFeature.bounds[1][0],
        left: featureValue,
        right: value
      };
      left = left !== PARSE_ERROR ? {
        type: 2
        /* Conjunction */
        ,
        left,
        right
      } : right;
    }

    return left;
  }
}

function isValidContainerName(name) {
  name = name.toLowerCase();
  return !isContainerStandaloneKeyword(name) && !CONTAINER_INVALID_NAMES.has(name);
}

function consumeZeroOrMoreIdents(parser, fn) {
  const idents = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    consumeWhitespace(parser);
    const next = parser.at(1);

    if (next.type !== 24
    /* IdentToken */
    || !fn(next.value)) {
      return idents;
    }

    parser.consume(1);
    idents.push(next.value);
  }
}

function consumeContainerNames(parser) {
  const names = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    consumeWhitespace(parser);
    const next = parser.at(1);

    if (next.type !== 24
    /* IdentToken */
    ) {
      break;
    }

    const name = next.value;

    if (!isValidContainerName(name)) {
      break;
    }

    parser.consume(1);
    names.push(name);
  }

  return names;
}

function isContainerStandaloneKeyword(name) {
  return CONTAINER_STANDALONE_KEYWORD.has(name);
}

function transformInternalKeywords(idents) {
  /**
   * Keywords like `inherit` have specific semantics when used in
   * a declaration, that don't necessary match the semantics we want.
   *
   * To solve this, we just append our own prefix to it when serializing
   * it out to CSS.
   */
  return idents.map(ident => INTERNAL_KEYWORD_PREFIX + ident);
}

function consumeContainerStandaloneKeyword(parser) {
  const keywords = consumeZeroOrMoreIdents(parser, ident => isContainerStandaloneKeyword(ident));
  return keywords.length === 1 ? transformInternalKeywords(keywords) : PARSE_ERROR;
}

function consumeContainerTypes(parser) {
  const keywords = consumeZeroOrMoreIdents(parser, type => type === 'normal');

  if (keywords.length === 1) {
    return transformInternalKeywords(keywords);
  } else if (keywords.length !== 0) {
    return PARSE_ERROR;
  }

  const types = consumeZeroOrMoreIdents(parser, type => CONTAINER_TYPES.has(type));
  return types.length > 0 && isEOF(parser) ? types : PARSE_ERROR;
}

function consumeContainerNameProperty(parser, standalone) {
  const keywords = consumeZeroOrMoreIdents(parser, type => type === 'none');

  if (keywords.length === 1) {
    return transformInternalKeywords(keywords);
  } else if (keywords.length !== 0) {
    return PARSE_ERROR;
  }

  if (standalone) {
    const maybeKeywords = consumeContainerStandaloneKeyword(parser);

    if (maybeKeywords !== PARSE_ERROR) {
      return maybeKeywords;
    }
  }

  const names = consumeContainerNames(parser);
  return names.length > 0 && (!standalone || isEOF(parser)) ? names : PARSE_ERROR;
}
function consumeContainerTypeProperty(parser, standalone) {
  if (standalone) {
    const maybeKeywords = consumeContainerStandaloneKeyword(parser);

    if (maybeKeywords !== PARSE_ERROR) {
      return maybeKeywords;
    }
  }

  return consumeContainerTypes(parser);
}
function parseContainerShorthand(nodes) {
  const parser = createNodeParser(nodes);
  const keywords = consumeContainerStandaloneKeyword(parser);

  if (keywords !== PARSE_ERROR) {
    return [keywords, keywords];
  }

  const result = consumeMaybeSeparatedByDelim(parser, '/', () => consumeContainerNameProperty(parser, false), () => consumeContainerTypeProperty(parser, false));
  return result !== PARSE_ERROR && isEOF(parser) ? [result[0], result[1] || []] : PARSE_ERROR;
}
function parseContainerRule(nodes) {
  const parser = createNodeParser(nodes);
  const names = consumeContainerNames(parser);

  if (!names || names.length > 1) {
    return PARSE_ERROR;
  }

  const rawCondition = consumeMediaCondition(parser);

  if (rawCondition === PARSE_ERROR) {
    return PARSE_ERROR;
  }

  const context = {
    features: new Set()
  };
  const condition = transformExpression(rawCondition, context);
  return isEOF(parser) ? {
    name: names.length > 0 ? names[0] : null,
    condition,
    features: context.features
  } : PARSE_ERROR;
}

function transformExpression(node, context) {
  switch (node.type) {
    case 1
    /* Negate */
    :
      return {
        type: 1
        /* Negate */
        ,
        value: transformExpression(node.value, context)
      };

    case 2
    /* Conjunction */
    :
    case 3
    /* Disjunction */
    :
      return {
        type: node.type === 2
        /* Conjunction */
        ? 2
        /* Conjunction */
        : 3
        /* Disjunction */
        ,
        left: transformExpression(node.left, context),
        right: transformExpression(node.right, context)
      };

    case 4
    /* Literal */
    :
      {
        if (node.value.type === 28
        /* BlockNode */
        ) {
          const expression = parseSizeFeature(createNodeParser(node.value.value.value), context);

          if (expression !== PARSE_ERROR) {
            return expression;
          }
        }

        return {
          type: 6
          /* Value */
          ,
          value: {
            type: 1
            /* Unknown */

          }
        };
      }
  }
}

let CONTAINER_ID = 0;
const CUSTOM_UNIT_MAP = {
  cqw: CUSTOM_UNIT_VARIABLE_CQW,
  cqh: CUSTOM_UNIT_VARIABLE_CQH,
  cqi: CUSTOM_UNIT_VARIABLE_CQI,
  cqb: CUSTOM_UNIT_VARIABLE_CQB
};
const SUPPORTS_WHERE_PSEUDO_CLASS = CSS.supports('selector(:where(div))');
const NO_WHERE_SELECTOR = ':not(.container-query-polyfill)';
parseComponentValue(Array.from(tokenize(NO_WHERE_SELECTOR)));
const DUMMY_ELEMENT = document.createElement('div'); // https://www.w3.org/TR/selectors-4/#single-colon-pseudos

const SINGLE_COLON_PSEUDO_ELEMENTS = new Set(['before', 'after', 'first-line', 'first-letter']);

function transformContainerDimensions(node) {
  const name = node.unit;
  const variable = CUSTOM_UNIT_MAP[name];

  if (variable != null) {
    return generateCalcExpression(node, customVar(variable));
  } else if (name === 'cqmin' || name === 'cqmax') {
    return generateCalcExpression(node, func(node.unit.slice(2), [customVar(CUSTOM_UNIT_VARIABLE_CQI), {
      type: 6
      /* CommaToken */

    }, customVar(CUSTOM_UNIT_VARIABLE_CQB)]));
  }

  return node;
}

function generateCalcExpression(node, unit) {
  return func('calc', [{
    type: 17
    /* NumberToken */
    ,
    flag: node.flag,
    value: node.value
  }, delim('*'), unit]);
}

function transformContainerUnits(nodes) {
  return nodes.map(node => {
    switch (node.type) {
      case 15
      /* DimensionToken */
      :
        return transformContainerDimensions(node);

      case 27
      /* FunctionNode */
      :
        return _extends({}, node, {
          value: transformContainerUnits(node.value)
        });
    }

    return node;
  });
}

function transformPropertyDeclaration(node) {
  switch (node.name) {
    case 'container':
      {
        const result = parseContainerShorthand(node.value);
        return result ? _extends({}, node, {
          name: CUSTOM_PROPERTY_SHORTHAND
        }) : node;
      }

    case 'container-name':
      {
        const result = consumeContainerNameProperty(createNodeParser(node.value), true);
        return result ? _extends({}, node, {
          name: CUSTOM_PROPERTY_NAME
        }) : node;
      }

    case 'container-type':
      {
        const result = consumeContainerTypeProperty(createNodeParser(node.value), true);
        return result != null ? _extends({}, node, {
          name: CUSTOM_PROPERTY_TYPE
        }) : node;
      }
  }

  return _extends({}, node, {
    value: transformContainerUnits(node.value)
  });
}

function transformDeclarationBlock(node, transformAtRule) {
  const declarations = [];
  let containerNames = null;
  let containerTypes = null;

  for (const declaration of node.value.value) {
    switch (declaration.type) {
      case 25
      /* AtRuleNode */
      :
        {
          const newAtRule = transformAtRule ? transformAtRule(declaration) : declaration;

          if (newAtRule) {
            declarations.push(newAtRule);
          }
        }
        break;

      case 29
      /* DeclarationNode */
      :
        {
          const newDeclaration = transformPropertyDeclaration(declaration);

          switch (newDeclaration.name) {
            case CUSTOM_PROPERTY_SHORTHAND:
              {
                const result = parseContainerShorthand(declaration.value);

                if (result !== PARSE_ERROR) {
                  containerNames = result[0];
                  containerTypes = result[1];
                }

                break;
              }

            case CUSTOM_PROPERTY_NAME:
              {
                const result = consumeContainerNameProperty(createNodeParser(declaration.value), true);

                if (result !== PARSE_ERROR) {
                  containerNames = result;
                }

                break;
              }

            case CUSTOM_PROPERTY_TYPE:
              {
                const result = consumeContainerTypeProperty(createNodeParser(declaration.value), true);

                if (result !== PARSE_ERROR) {
                  containerTypes = result;
                }

                break;
              }

            default:
              declarations.push(newDeclaration);
              break;
          }
        }
        break;
    }
  }

  if (containerNames && containerNames.length > 0) {
    declarations.push(decl(CUSTOM_PROPERTY_NAME, [ident(containerNames.join(' '))]));
  }

  if (containerTypes && containerTypes.length > 0) {
    declarations.push(decl(CUSTOM_PROPERTY_TYPE, [ident(containerTypes.join(' '))]));
  }

  return _extends({}, node, {
    value: {
      type: 2
      /* DeclarationList */
      ,
      value: declarations
    }
  });
}
function transpileStyleSheet(sheetSrc, srcUrl) {
  try {
    const tokens = Array.from(tokenize(sheetSrc));

    if (srcUrl) {
      // Ensure any URLs are absolute
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token.type === 20
        /* URLToken */
        ) {
          token.value = new URL(token.value, srcUrl).toString();
        } else if (token.type === 23
        /* FunctionToken */
        && token.value.toLowerCase() === 'url') {
          const nextToken = i + 1 < tokens.length ? tokens[i + 1] : null;

          if (nextToken && nextToken.type === 2
          /* StringToken */
          ) {
            nextToken.value = new URL(nextToken.value, srcUrl).toString();
          }
        }
      }
    }

    const context = {
      descriptors: [],
      parent: null,
      transformStyleRule: rule => rule
    };
    const rules = transformStylesheet(parseStylesheet(tokens, true), context);
    return {
      source: serializeBlock(rules),
      descriptors: context.descriptors
    };
  } catch (e) {
    console.warn('An error occurred while transpiling stylesheet: ' + e);
    return {
      source: sheetSrc,
      descriptors: []
    };
  }
}

function transformStylesheet(node, context) {
  return _extends({}, node, {
    value: node.value.map(rule => {
      switch (rule.type) {
        case 25
        /* AtRuleNode */
        :
          return transformAtRule(rule, context);

        case 26
        /* QualifiedRuleNode */
        :
          return transformStyleRule(rule, context);

        default:
          return rule;
      }
    })
  });
}

function isEndOfSelector(n1) {
  return n1.type === 0
  /* EOFToken */
  || n1.type === 6
  /* CommaToken */
  ;
}

function isPseudoElementStart(n1, n2) {
  return isEndOfSelector(n1) || n1.type === 7
  /* ColonToken */
  && (n2.type === 7
  /* ColonToken */
  || n2.type === 24
  /* IdentToken */
  && SINGLE_COLON_PSEUDO_ELEMENTS.has(n2.value.toLowerCase()));
}

function trimTrailingWhitespace(nodes) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    if (nodes[i].type !== 1
    /* WhitespaceToken */
    ) {
      return nodes.slice(0, i + 1);
    }
  }

  return nodes;
}

function transformSelector(nodes, containerUID, invalidSelectorCallback) {
  const parser = createNodeParser(nodes);
  const elementSelector = [];
  const styleSelector = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    if (parser.at(1).type === 0
    /* EOFToken */
    ) {
      return [elementSelector, styleSelector];
    }

    const selectorStartIndex = Math.max(0, parser.index); // Consume non-pseudo part

    while (!isPseudoElementStart(parser.at(1), parser.at(2))) {
      parser.consume(1);
    }

    const pseudoStartIndex = parser.index + 1;
    const rawTargetSelector = nodes.slice(selectorStartIndex, pseudoStartIndex);
    const targetSelector = rawTargetSelector.length > 0 ? trimTrailingWhitespace(rawTargetSelector) : [delim('*')]; // Consume pseudo part

    while (!isEndOfSelector(parser.at(1))) {
      parser.consume(1);
    }

    const pseudoPart = nodes.slice(pseudoStartIndex, Math.max(0, parser.index + 1));
    const isSelfSelector = pseudoPart.length > 0;
    let targetSelectorForStyle = targetSelector;
    let styleSelectorSuffix = [{
      type: 28
      /* BlockNode */
      ,
      source: {
        type: 9
        /* LeftSquareBracketToken */

      },
      value: {
        type: 0
        /* SimpleBlock */
        ,
        value: [ident(isSelfSelector ? DATA_ATTRIBUTE_SELF : DATA_ATTRIBUTE_CHILD), delim('~'), delim('='), {
          type: 2
          /* StringToken */
          ,
          value: containerUID
        }]
      }
    }];

    if (!SUPPORTS_WHERE_PSEUDO_CLASS) {
      const actual = targetSelector.map(serialize).join('');

      if (!actual.endsWith(NO_WHERE_SELECTOR)) {
        invalidSelectorCallback({
          actual,
          expected: actual + NO_WHERE_SELECTOR
        });
      } else {
        targetSelectorForStyle = parseComponentValue(Array.from(tokenize(actual.substring(0, actual.length - NO_WHERE_SELECTOR.length))));
      }
    } else {
      styleSelectorSuffix = [delim(':'), func('where', styleSelectorSuffix)];
    }

    elementSelector.push(...targetSelector);
    styleSelector.push(...targetSelectorForStyle);
    styleSelector.push(...styleSelectorSuffix);
    styleSelector.push(...pseudoPart); // Consume the end of the selector

    parser.consume(1);
  }
}

function transformMediaAtRule(node, context) {
  return _extends({}, node, {
    value: node.value ? _extends({}, node.value, {
      value: transformStylesheet(parseStylesheet(node.value.value.value), context)
    }) : null
  });
}

function transformKeyframesAtRule(node, context) {
  let value = null;

  if (node.value) {
    value = _extends({}, node.value, {
      value: {
        type: 3
        /* RuleList */
        ,
        value: parseStylesheet(node.value.value.value).value.map(rule => {
          switch (rule.type) {
            case 26
            /* QualifiedRuleNode */
            :
              return transformKeyframeRule(rule, context);

            case 25
            /* AtRuleNode */
            :
              return transformAtRule(rule, context);
          }
        })
      }
    });
  }

  return _extends({}, node, {
    value
  });
}

function transformDeclarationBlockWithContext(node, context) {
  return transformDeclarationBlock(node, node => transformAtRule(node, context));
}

function transformKeyframeRule(node, context) {
  return _extends({}, node, {
    value: transformDeclarationBlockWithContext(node.value, context)
  });
}

function transformSupportsExpression(node) {
  if (node.type === 1
  /* Negate */
  ) {
    return _extends({}, node, {
      value: transformSupportsExpression(node.value)
    });
  } else if (node.type === 2
  /* Conjunction */
  || node.type === 3
  /* Disjunction */
  ) {
    return _extends({}, node, {
      left: transformSupportsExpression(node.left),
      right: transformSupportsExpression(node.right)
    });
  } else if (node.type === 4
  /* Literal */
  && node.value.type === 28
  /* BlockNode */
  ) {
    const declaration = parseDeclaration(node.value.value.value);

    if (declaration !== PARSE_ERROR) {
      return _extends({}, node, {
        value: _extends({}, node.value, {
          value: {
            type: 0
            /* SimpleBlock */
            ,
            value: [transformPropertyDeclaration(declaration)]
          }
        })
      });
    }
  }

  return node;
}

function transformSupportsAtRule(node, context) {
  let condition = parseMediaCondition(node.prelude);
  condition = condition !== PARSE_ERROR ? transformSupportsExpression(condition) : PARSE_ERROR;
  return _extends({}, node, {
    prelude: condition !== PARSE_ERROR ? transformMediaConditionToTokens(condition) : node.prelude,
    value: node.value ? _extends({}, node.value, {
      value: transformStylesheet(parseStylesheet(node.value.value.value), context)
    }) : null
  });
}

function transformContainerAtRule(node, context) {
  if (node.value) {
    const rule = parseContainerRule(node.prelude);

    if (rule !== PARSE_ERROR) {
      const descriptor = {
        rule,
        selector: null,
        parent: context.parent,
        uid: `c${CONTAINER_ID++}`
      };
      const elementSelectors = new Set();
      const invalidSelectors = [];
      const transformedRules = transformStylesheet(parseStylesheet(node.value.value.value), {
        descriptors: context.descriptors,
        parent: descriptor,
        transformStyleRule: rule => {
          const [elementSelector, styleSelector] = transformSelector(rule.prelude, descriptor.uid, invalidSelector => {
            invalidSelectors.push(invalidSelector);
          });

          if (invalidSelectors.length > 0) {
            return rule;
          }

          const elementSelectorText = elementSelector.map(serialize).join('');

          try {
            DUMMY_ELEMENT.matches(elementSelectorText);
            elementSelectors.add(elementSelectorText);
          } catch (_unused) {// If `matches` throws, we won't use the selector when testing elements.
          }

          return _extends({}, rule, {
            prelude: styleSelector
          });
        }
      }).value;

      if (invalidSelectors.length > 0) {
        const selectors = new Set();
        const lines = [];
        let largestLength = 0;

        for (const {
          actual
        } of invalidSelectors) {
          largestLength = Math.max(largestLength, actual.length);
        }

        const spaces = Array.from({
          length: largestLength
        }, () => ' ').join('');

        for (const {
          actual,
          expected
        } of invalidSelectors) {
          if (!selectors.has(actual)) {
            lines.push(`${actual}${spaces.substring(0, largestLength - actual.length)} => ${expected}`);
            selectors.add(actual);
          }
        }

        console.warn(`The :where() pseudo-class is not supported by this browser. ` + `To use the Container Query Polyfill, you must modify the ` + `selectors under your @container rules:\n\n${lines.join('\n')}`);
      }

      if (elementSelectors.size > 0) {
        descriptor.selector = Array.from(elementSelectors).join(', ');
      }

      context.descriptors.push(descriptor);
      return {
        type: 25
        /* AtRuleNode */
        ,
        name: 'media',
        prelude: [ident('all')],
        value: _extends({}, node.value, {
          value: {
            type: 3
            /* RuleList */
            ,
            value: transformedRules
          }
        })
      };
    }
  }

  return node;
}

function transformLayerAtRule(node, context) {
  return _extends({}, node, {
    value: node.value ? _extends({}, node.value, {
      value: transformStylesheet(parseStylesheet(node.value.value.value), context)
    }) : null
  });
}

function transformAtRule(node, context) {
  switch (node.name.toLocaleLowerCase()) {
    case 'media':
      return transformMediaAtRule(node, context);

    case 'keyframes':
      return transformKeyframesAtRule(node, context);

    case 'supports':
      return transformSupportsAtRule(node, context);

    case 'container':
      return transformContainerAtRule(node, context);

    case 'layer':
      return transformLayerAtRule(node, context);
  }

  return node;
}

function transformStyleRule(node, context) {
  return context.transformStyleRule(_extends({}, node, {
    value: transformDeclarationBlockWithContext(node.value, context)
  }));
}

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Reference {
  constructor(value) {
    this.value = void 0;
    this.value = value;
  }

}
function memoizeAndReuse(fn) {
  let previousResult = null;
  return (...args) => {
    if (previousResult == null || !areEqual(previousResult[0], args)) {
      const currentResult = fn(...args);

      if (previousResult == null || !areEqual(previousResult[1], currentResult)) {
        previousResult = [args, currentResult];
      }
    }

    return previousResult[1];
  };
}

function areEqual(lhs, rhs) {
  if (lhs === rhs) {
    return true;
  }

  if (typeof lhs === typeof rhs) {
    if (lhs !== null && rhs !== null && typeof lhs === 'object') {
      if (Array.isArray(lhs)) {
        if (!Array.isArray(rhs) || rhs.length !== lhs.length) {
          return false;
        }

        for (let i = 0, length = lhs.length; i < length; i++) {
          if (!areEqual(lhs[i], rhs[i])) {
            return false;
          }
        }

        return true;
      } else if (lhs instanceof Reference) {
        if (!(rhs instanceof Reference) || lhs.value !== rhs.value) {
          return false;
        }

        return true;
      } else {
        const leftKeys = Object.keys(lhs);

        if (leftKeys.length !== Object.keys(rhs).length) {
          return false;
        }

        for (let i = 0, length = leftKeys.length; i < length; i++) {
          const key = leftKeys[i]; // eslint-disable-next-line @typescript-eslint/no-explicit-any

          if (!areEqual(lhs[key], rhs[key])) {
            return false;
          }
        }

        return true;
      }
    }
  }

  return false;
}

const INSTANCE_SYMBOL = Symbol('CQ_INSTANCE');
const STYLESHEET_SYMBOL = Symbol('CQ_STYLESHEET');
const SHADOW_SYMBOL = Symbol('CQ_SHADOW');
const SUPPORTS_SMALL_VIEWPORT_UNITS = CSS.supports('width: 1svh');
const VERTICAL_WRITING_MODES = new Set(['vertical-lr', 'vertical-rl', 'sideways-rl', 'sideways-lr', 'tb', 'tb-lr', 'tb-rl']);
const WIDTH_BORDER_BOX_PROPERTIES = ['padding-left', 'padding-right', 'border-left-width', 'border-right-width'];
const HEIGHT_BORDER_BOX_PROPERTIES = ['padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width'];
/**
 * For matching:
 *
 * display: [ table | ruby ]
 * display: [ block | inline | ... ] [ table | ruby ]
 * display: table-[ row | cell | ... ]
 * display: ruby-[ base | text | ... ]
 * display: inline-table
 *
 * https://drafts.csswg.org/css-display-3/#the-display-properties
 */

const TABLE_OR_RUBY_DISPLAY_TYPE = /(\w*(\s|-))?(table|ruby)(-\w*)?/;

function initializePolyfill(updateCallback) {
  function getInstance(node) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controller = node[INSTANCE_SYMBOL];
    return controller ? controller : null;
  }

  const documentElement = document.documentElement;

  if (getInstance(documentElement)) {
    return;
  }

  const dummyElement = document.createElement(`cq-polyfill-${PER_RUN_UID}`);
  const globalStyleElement = document.createElement('style');

  const createMutationObserver = () => new MutationObserver(mutations => {
    for (const entry of mutations) {
      for (const node of entry.removedNodes) {
        const instance = getInstance(node); // Note: We'll recurse into the nodes inside disconnect.

        instance == null ? void 0 : instance.disconnect();
      }

      if (entry.target.nodeType !== Node.DOCUMENT_NODE && entry.target.nodeType !== Node.DOCUMENT_FRAGMENT_NODE && entry.target.parentNode === null) {
        continue;
      }

      if (entry.type === 'attributes' && entry.attributeName && (entry.attributeName === DATA_ATTRIBUTE_SELF || entry.attributeName === DATA_ATTRIBUTE_CHILD || entry.target instanceof Element && entry.target.getAttribute(entry.attributeName) === entry.oldValue)) {
        continue;
      } // Note: We'll recurse into the nodes inside mutate.


      getOrCreateInstance(entry.target).mutate();
      scheduleUpdate();
    }
  });

  const mutationObserver = createMutationObserver();
  mutationObserver.observe(documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true
  });
  const originalAttachShadow = Element.prototype.attachShadow;

  Element.prototype.attachShadow = function (options) {
    const shadow = originalAttachShadow.apply(this, [options]); // eslint-disable-next-line @typescript-eslint/no-explicit-any

    this[SHADOW_SYMBOL] = shadow;
    getOrCreateInstance(shadow);
    return shadow;
  };

  const originalReplaceSync = CSSStyleSheet.prototype.replaceSync;

  if (originalReplaceSync) {
    CSSStyleSheet.prototype.replaceSync = function (options) {
      const result = transpileStyleSheet(options, undefined);
      setDescriptorsForStyleSheet(this, result.descriptors);
      const replaceSync = originalReplaceSync.apply(this, [result.source]);
      return replaceSync;
    };
  }

  const originalReplace = CSSStyleSheet.prototype.replace;

  if (originalReplace) {
    CSSStyleSheet.prototype.replace = function (options) {
      const result = transpileStyleSheet(options, undefined);
      setDescriptorsForStyleSheet(this, result.descriptors);
      const replace = originalReplace.apply(this, [result.source]);
      return replace;
    };
  } // TODO: implement monkeypatch for CSSStyleSheet.prototype.insertRule and CSSStyleSheet.prototype.deleteRule
  // as they currently are not handled.


  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const instance = getOrCreateInstance(entry.target);
      instance.resize();
    }

    getOrCreateInstance(documentElement).update(computeRootState());
    updateCallback();
  });
  const rootController = new NodeController(documentElement);

  async function registerStyleSheet(node, {
    source,
    url,
    signal
  }) {
    const result = transpileStyleSheet(source, url ? url.toString() : undefined);

    let dispose = () => {
      /* noop */
    };

    let refresh = () => {
      /* noop */
    };

    const documentInstance = getOrCreateInstance(documentElement);
    let didSetDescriptors = false;

    if (!(signal != null && signal.aborted)) {
      refresh = () => {
        if (!didSetDescriptors) {
          const {
            sheet
          } = node;

          if (sheet != null) {
            setDescriptorsForStyleSheet(sheet, result.descriptors);
            didSetDescriptors = true;

            dispose = () => {
              setDescriptorsForStyleSheet(sheet);
              documentInstance.mutate();
              scheduleUpdate();
            };

            documentInstance.mutate();
            scheduleUpdate();
          }
        }
      };
    }

    return {
      source: result.source,
      dispose,
      refresh
    };
  }

  const fallbackContainerUnits = {
    cqw: null,
    cqh: null
  };

  function viewportChanged({
    width,
    height
  }) {
    fallbackContainerUnits.cqw = width;
    fallbackContainerUnits.cqh = height;
  }

  function updateAttributes(node, state, attribute) {
    if (node instanceof Element && state) {
      let attributes = '';

      for (const [queryRef, result] of state.conditions) {
        const query = queryRef.value;

        if (query.selector != null) {
          const isValidCondition = result != null && (result & 2
          /* Container */
          ) === 2
          /* Container */
          ;

          if (isValidCondition && node.matches(query.selector)) {
            if (attributes.length > 0) {
              attributes += ' ';
            }

            attributes += query.uid;
          }
        }
      }

      if (attributes.length > 0) {
        node.setAttribute(attribute, attributes);
      } else {
        node.removeAttribute(attribute);
      }
    }
  }

  function scheduleUpdate() {
    resizeObserver.unobserve(documentElement);
    resizeObserver.observe(documentElement);
  }

  const computeRootConditions = () => {
    const rootQueryDescriptors = [];

    for (const styleSheet of document.styleSheets) {
      for (const query of getDescriptorsForStyleSheet(styleSheet)) {
        rootQueryDescriptors.push([new Reference(query), 0
        /* None */
        ]);
      }
    }

    return rootQueryDescriptors;
  };

  const rootStyles = window.getComputedStyle(documentElement);

  const computeRootState = () => {
    const readProperty = name => rootStyles.getPropertyValue(name);

    const layoutData = computeLayoutData(readProperty);
    const sizeData = computeSizeData(readProperty);
    return {
      parentState: null,
      conditions: computeRootConditions(),
      context: _extends({}, fallbackContainerUnits, {
        fontSize: sizeData.fontSize,
        rootFontSize: sizeData.fontSize,
        writingAxis: layoutData.writingAxis
      }),
      displayFlags: layoutData.displayFlags,
      isQueryContainer: false
    };
  };

  const defaultStateProvider = parentState => parentState;

  function createShadowRootStateProvider(node) {
    return state => {
      const rootQueryDescriptors = [];

      const pushReference = query => {
        rootQueryDescriptors.push([new Reference(query), 0
        /* None */
        ]);
      };

      for (const adoptedStyleSheet of node.adoptedStyleSheets) {
        if (adoptedStyleSheet) {
          for (const query of getDescriptorsForStyleSheet(adoptedStyleSheet)) {
            pushReference(query);
          }
        }
      }

      for (const styleSheet of node.styleSheets) {
        if (styleSheet) {
          for (const query of getDescriptorsForStyleSheet(styleSheet)) {
            pushReference(query);
          }
        }
      }

      return _extends({}, state, {
        conditions: rootQueryDescriptors
      });
    };
  }

  function getOrCreateInstance(node) {
    let instance = getInstance(node);

    if (!instance) {
      let innerController;
      let stateProvider = null;
      let alwaysObserveSize = false;

      if (node === documentElement) {
        innerController = rootController;
        stateProvider = defaultStateProvider;
      } else if (node === dummyElement) {
        alwaysObserveSize = true;
        innerController = new DummyElementController(dummyElement, {
          viewportChanged
        });
      } else if (node === globalStyleElement) {
        innerController = new GlobalStyleElementController(globalStyleElement);
      } else if (node instanceof HTMLLinkElement) {
        innerController = new LinkElementController(node, {
          registerStyleSheet: options => registerStyleSheet(node, _extends({}, options))
        });
      } else if (node instanceof ShadowRoot) {
        innerController = new ShadowRootController(node, createMutationObserver());
        stateProvider = createShadowRootStateProvider(node);
      } else if (node instanceof HTMLStyleElement) {
        innerController = new StyleElementController(node, {
          registerStyleSheet: options => registerStyleSheet(node, _extends({}, options))
        });
      } else {
        innerController = new NodeController(node);
      }

      let cacheKey = Symbol();

      if (stateProvider == null && node instanceof Element) {
        const computeState = createStateComputer(node);

        stateProvider = parentState => computeState(parentState, cacheKey);
      }

      const innerStateProvider = stateProvider ? stateProvider : defaultStateProvider;
      let previousLayoutState = null;

      const maybeComputeState = parentState => {
        const currentLayoutState = previousLayoutState;
        const nextLayoutState = innerStateProvider(parentState);
        previousLayoutState = nextLayoutState;
        return [previousLayoutState, previousLayoutState !== currentLayoutState];
      };

      const inlineStyles = node instanceof HTMLElement || node instanceof SVGElement ? node.style : null;
      let isObservingSize = false;
      instance = {
        connect() {
          for (let child = node.firstChild; child != null; child = child.nextSibling) {
            // Ensure all children are created and connected first.
            getOrCreateInstance(child);
          }

          innerController.connected();
        },

        disconnect() {
          if (node instanceof Element) {
            resizeObserver.unobserve(node);
            node.removeAttribute(DATA_ATTRIBUTE_SELF);
            node.removeAttribute(DATA_ATTRIBUTE_CHILD);
          }

          if (inlineStyles) {
            inlineStyles.removeProperty(CUSTOM_UNIT_VARIABLE_CQI);
            inlineStyles.removeProperty(CUSTOM_UNIT_VARIABLE_CQB);
            inlineStyles.removeProperty(CUSTOM_UNIT_VARIABLE_CQW);
            inlineStyles.removeProperty(CUSTOM_UNIT_VARIABLE_CQH);
          }

          for (let child = node.firstChild; child != null; child = child.nextSibling) {
            const instance = getInstance(child);
            instance == null ? void 0 : instance.disconnect();
          }

          innerController.disconnected(); // eslint-disable-next-line @typescript-eslint/no-explicit-any

          delete node[INSTANCE_SYMBOL];
        },

        update(parentState) {
          const [currentState, stateChanged] = maybeComputeState(parentState);

          if (stateChanged) {
            updateAttributes(node, parentState, DATA_ATTRIBUTE_CHILD);
            updateAttributes(node, currentState, DATA_ATTRIBUTE_SELF);

            if (node instanceof Element) {
              const shouldObserveSize = alwaysObserveSize || currentState.isQueryContainer;

              if (shouldObserveSize && !isObservingSize) {
                resizeObserver.observe(node);
                isObservingSize = true;
              } else if (!shouldObserveSize && isObservingSize) {
                resizeObserver.unobserve(node);
                isObservingSize = false;
              }
            }

            if (inlineStyles) {
              const context = currentState.context;
              const writingAxis = context.writingAxis;
              let cqi = null;
              let cqb = null;
              let cqw = null;
              let cqh = null;

              if (writingAxis !== parentState.context.writingAxis || currentState.isQueryContainer) {
                cqi = `var(${writingAxis === 0
                /* Horizontal */
                ? CUSTOM_UNIT_VARIABLE_CQW : CUSTOM_UNIT_VARIABLE_CQH})`;
                cqb = `var(${writingAxis === 1
                /* Vertical */
                ? CUSTOM_UNIT_VARIABLE_CQW : CUSTOM_UNIT_VARIABLE_CQH})`;
              }

              if (!parentState || currentState.isQueryContainer) {
                if (context.cqw) {
                  cqw = context.cqw + 'px';
                }

                if (context.cqh) {
                  cqh = context.cqh + 'px';
                }
              }

              setProperty(inlineStyles, CUSTOM_UNIT_VARIABLE_CQI, cqi);
              setProperty(inlineStyles, CUSTOM_UNIT_VARIABLE_CQB, cqb);
              setProperty(inlineStyles, CUSTOM_UNIT_VARIABLE_CQW, cqw);
              setProperty(inlineStyles, CUSTOM_UNIT_VARIABLE_CQH, cqh);
            }

            innerController.updated();
          }

          for (let child = node.firstChild; child != null; child = child.nextSibling) {
            getOrCreateInstance(child).update(currentState);
          } // eslint-disable-next-line @typescript-eslint/no-explicit-any


          const shadow = node[SHADOW_SYMBOL];

          if (shadow) {
            getOrCreateInstance(shadow).update(currentState);
          }
        },

        resize() {
          cacheKey = Symbol();
        },

        mutate() {
          cacheKey = Symbol();
          innerController.mutated();

          for (let child = node.firstChild; child != null; child = child.nextSibling) {
            getOrCreateInstance(child).mutate();
          } // eslint-disable-next-line @typescript-eslint/no-explicit-any


          const shadow = node[SHADOW_SYMBOL];

          if (shadow) {
            getOrCreateInstance(shadow).mutate();
          }
        }

      }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

      node[INSTANCE_SYMBOL] = instance;
      instance.connect();
    }

    return instance;
  }

  documentElement.prepend(globalStyleElement, dummyElement);
  getOrCreateInstance(documentElement);
  scheduleUpdate();
}

class NodeController {
  constructor(node) {
    this.node = void 0;
    this.node = node;
  }

  connected() {// Handler implemented by subclasses
  }

  disconnected() {// Handler implemented by subclasses
  }

  updated() {// Handler implemented by subclasses
  }

  mutated() {// Handler implemented by subclasses
  }

}

class LinkElementController extends NodeController {
  constructor(node, context) {
    super(node);
    this.context = void 0;
    this.controller = null;
    this.styleSheet = null;
    this.context = context;
  }

  connected() {
    var _this = this;

    const node = this.node;

    if (node.rel === 'stylesheet') {
      const url = new URL(node.href, document.baseURI);

      if (url.origin === location.origin) {
        this.controller = tryAbortableFunction(async function (signal) {
          const response = await fetch(url.toString(), {
            signal
          });
          const source = await response.text();
          const styleSheet = _this.styleSheet = await _this.context.registerStyleSheet({
            source,
            url,
            signal
          });
          const blob = new Blob([styleSheet.source], {
            type: 'text/css'
          });
          /**
           * Even though it's a data URL, it may take several frames
           * before the stylesheet is loaded. Additionally, the `onload`
           * event isn't triggered on elements that have already loaded.
           *
           * Therefore, we use a dummy image to detect the right time
           * to refresh.
           */

          const img = new Image();
          img.onload = img.onerror = styleSheet.refresh;
          img.src = node.href = URL.createObjectURL(blob);
        });
      }
    }
  }

  disconnected() {
    var _this$controller, _this$styleSheet;

    (_this$controller = this.controller) == null ? void 0 : _this$controller.abort();
    this.controller = null;
    (_this$styleSheet = this.styleSheet) == null ? void 0 : _this$styleSheet.dispose();
    this.styleSheet = null;
  }

}

class StyleElementController extends NodeController {
  constructor(node, context) {
    super(node);
    this.context = void 0;
    this.controller = null;
    this.styleSheet = null;
    this.context = context;
  }

  connected() {
    var _this2 = this;

    this.controller = tryAbortableFunction(async function (signal) {
      const node = _this2.node;
      const styleSheet = _this2.styleSheet = await _this2.context.registerStyleSheet({
        source: node.innerHTML,
        signal
      });
      node.innerHTML = styleSheet.source;
      styleSheet.refresh();
    });
  }

  disconnected() {
    var _this$controller2, _this$styleSheet2;

    (_this$controller2 = this.controller) == null ? void 0 : _this$controller2.abort();
    this.controller = null;
    (_this$styleSheet2 = this.styleSheet) == null ? void 0 : _this$styleSheet2.dispose();
    this.styleSheet = null;
  }

}

class ShadowRootController extends NodeController {
  constructor(node, mo) {
    super(node);
    this.controller = null;
    this.mo = void 0;
    this.host = void 0;
    this.mo = mo;
    this.host = node.host;
  }

  connected() {
    var _this$mo;

    (_this$mo = this.mo) == null ? void 0 : _this$mo.observe(this.node, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });
  }

  updated() {
    this.processCssRules();
  }

  mutated() {
    this.processCssRules();
  }

  disconnected() {
    var _this$controller3, _this$mo2;

    (_this$controller3 = this.controller) == null ? void 0 : _this$controller3.abort();
    this.controller = null;
    (_this$mo2 = this.mo) == null ? void 0 : _this$mo2.disconnect();
  }

  processCssRules() {
    let setProp = false;

    for (const adoptedStyleSheet of this.node.adoptedStyleSheets) {
      for (const rule of adoptedStyleSheet.cssRules) {
        if (rule instanceof CSSStyleRule) {
          const value = rule.style.getPropertyValue(CUSTOM_PROPERTY_TYPE).trim();

          if (value) {
            const selector = rule.selectorText.replace(':host', this.host.localName); // handle parentheses on :host([attribute])

            const mutatedSelector = !selector.includes(':') ? selector.replace('(', '').replace(')', '') : selector; // if match apply rule

            if (this.host.matches(mutatedSelector)) {
              this.host.style.setProperty(CUSTOM_PROPERTY_TYPE, value);
              setProp = true;
              break;
            }
          }
        }
      }
    }

    if (!setProp && this.host.style.getPropertyValue(CUSTOM_PROPERTY_TYPE)) {
      this.host.style.removeProperty(CUSTOM_PROPERTY_TYPE);
    }
  }

}

class GlobalStyleElementController extends NodeController {
  connected() {
    const style = `* { ${CUSTOM_PROPERTY_TYPE}: cq-normal; ${CUSTOM_PROPERTY_NAME}: cq-none; }`;
    this.node.innerHTML = // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof window.CSSLayerBlockRule === 'undefined' ? style : `@layer cq-polyfill-${PER_RUN_UID} { ${style} }`;
  }

}

class DummyElementController extends NodeController {
  constructor(node, context) {
    super(node);
    this.context = void 0;
    this.styles = void 0;
    this.context = context;
    this.styles = window.getComputedStyle(node);
  }

  connected() {
    this.node.style.cssText = 'position: fixed; top: 0; left: 0; visibility: hidden; ' + (SUPPORTS_SMALL_VIEWPORT_UNITS ? 'width: 1svw; height: 1svh;' : 'width: 1%; height: 1%;');
  }

  updated() {
    const sizeData = computeSizeData(name => this.styles.getPropertyValue(name));
    this.context.viewportChanged({
      width: sizeData.width,
      height: sizeData.height
    });
  }

}

function tryAbortableFunction(fn) {
  const controller = new AbortController();
  fn(controller.signal).catch(err => {
    if (!(err instanceof DOMException && err.message === 'AbortError')) {
      throw err;
    }
  });
  return controller;
}

function computeSizeFeatures(layoutData, sizeData) {
  const horizontalAxis = {
    value: sizeData.width
  };
  const verticalAxis = {
    value: sizeData.height
  };
  let inlineAxis = horizontalAxis;
  let blockAxis = verticalAxis;

  if (layoutData.writingAxis === 1
  /* Vertical */
  ) {
    const tmp = inlineAxis;
    inlineAxis = blockAxis;
    blockAxis = tmp;
  }

  if ((layoutData.containerType & 2
  /* BlockSize */
  ) !== 2
  /* BlockSize */
  ) {
    blockAxis.value = undefined;
  }

  return {
    width: horizontalAxis.value,
    height: verticalAxis.value,
    inlineSize: inlineAxis.value,
    blockSize: blockAxis.value
  };
}

function computeContainerType(containerType) {
  let type = 0
  /* None */
  ;

  if (containerType.length === 0) {
    return type;
  }

  if (containerType.startsWith(INTERNAL_KEYWORD_PREFIX)) {
    containerType = containerType.substring(INTERNAL_KEYWORD_PREFIX.length);

    if (containerType === 'normal' || isContainerStandaloneKeyword(containerType)) {
      return type;
    }
  }

  const parts = containerType.split(' ');

  for (const part of parts) {
    switch (part) {
      case 'size':
        type = type | (1
        /* InlineSize */
        | 2
        /* BlockSize */
        );
        break;

      case 'inline-size':
        type = type | 1
        /* InlineSize */
        ;
        break;

      default:
        return 0
        /* None */
        ;
    }
  }

  return type;
}

function computeDisplayFlags(displayType) {
  let flags = 0;

  if (displayType !== 'none') {
    flags |= 1
    /* Enabled */
    ;

    if (displayType !== 'contents' && displayType !== 'inline' && !TABLE_OR_RUBY_DISPLAY_TYPE.test(displayType)) {
      flags |= 2
      /* EligibleForSizeContainment */
      ;
    }
  }

  return flags;
}

function computeContainerNames(containerNames) {
  if (containerNames.startsWith(INTERNAL_KEYWORD_PREFIX)) {
    containerNames = containerNames.substring(INTERNAL_KEYWORD_PREFIX.length);

    if (containerNames === 'none' || isContainerStandaloneKeyword(containerNames)) {
      return new Set([]);
    }
  }

  return new Set(containerNames.length === 0 ? [] : containerNames.split(' '));
}

function computeWritingAxis(writingMode) {
  return VERTICAL_WRITING_MODES.has(writingMode) ? 1
  /* Vertical */
  : 0
  /* Horizontal */
  ;
}

function computeDimension(read, name) {
  return parseFloat(read(name));
}

function computeDimensionSum(read, names) {
  return names.reduce((value, name) => value + computeDimension(read, name), 0);
}

function createStateComputer(element) {
  const styles = window.getComputedStyle(element); // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return memoizeAndReuse((parentState, cacheKey) => {
    const {
      context: parentContext,
      conditions: parentConditions
    } = parentState;

    const readProperty = name => styles.getPropertyValue(name);

    const layoutData = computeLayoutData(readProperty);

    const context = _extends({}, parentContext, {
      writingAxis: layoutData.writingAxis
    });

    let conditions = parentConditions;
    let isQueryContainer = false;
    let displayFlags = layoutData.displayFlags;

    if ((parentState.displayFlags & 1
    /* Enabled */
    ) === 0) {
      displayFlags = 0;
    }

    const {
      containerType,
      containerNames
    } = layoutData;

    if (containerType > 0) {
      const isValidContainer = containerType > 0 && (displayFlags & 2
      /* EligibleForSizeContainment */
      ) === 2
      /* EligibleForSizeContainment */
      ;
      const parentConditionMap = new Map(parentConditions.map(entry => [entry[0].value, entry[1]]));
      conditions = [];
      isQueryContainer = true;

      if (isValidContainer) {
        const sizeData = computeSizeData(readProperty);
        context.fontSize = sizeData.fontSize;
        const sizeFeatures = computeSizeFeatures(layoutData, sizeData);
        const queryContext = {
          sizeFeatures,
          treeContext: context
        };

        const computeQueryCondition = query => {
          const {
            rule
          } = query;
          const name = rule.name;
          const result = name == null || containerNames.has(name) ? evaluateContainerCondition(rule, queryContext) : null;

          if (result == null) {
            var _parentConditionMap$g;

            const condition = (_parentConditionMap$g = parentConditionMap.get(query)) != null ? _parentConditionMap$g : 0
            /* None */
            ;
            return (condition && 1
            /* Condition */
            ) === 1
            /* Condition */
            ;
          }

          return result === true;
        };

        const computeQueryState = (conditionMap, query) => {
          let state = conditionMap.get(query);

          if (state == null) {
            const condition = computeQueryCondition(query);
            const container = condition === true && (query.parent == null || (computeQueryState(conditionMap, query.parent) & 1
            /* Condition */
            ) === 1
            /* Condition */
            );
            state = (condition ? 1
            /* Condition */
            : 0) | (container ? 2
            /* Container */
            : 0);
            conditionMap.set(query, state);
          }

          return state;
        };

        const newConditionMap = new Map();

        for (const entry of parentConditions) {
          conditions.push([entry[0], computeQueryState(newConditionMap, entry[0].value)]);
        }

        context.cqw = sizeFeatures.width != null ? sizeFeatures.width / 100 : parentContext.cqw;
        context.cqh = sizeFeatures.height != null ? sizeFeatures.height / 100 : parentContext.cqh;
      }
    }

    return {
      parentState: new Reference(parentState),
      conditions,
      context,
      displayFlags,
      isQueryContainer
    };
  });
}

function computeSizeData(read) {
  const isBorderBox = read('box-sizing') === 'border-box';
  let widthOffset = 0;
  let heightOffset = 0;

  if (isBorderBox) {
    widthOffset = computeDimensionSum(read, WIDTH_BORDER_BOX_PROPERTIES);
    heightOffset = computeDimensionSum(read, HEIGHT_BORDER_BOX_PROPERTIES);
  }

  return {
    fontSize: computeDimension(read, 'font-size'),
    width: computeDimension(read, 'width') - widthOffset,
    height: computeDimension(read, 'height') - heightOffset
  };
}

function computeLayoutData(read) {
  return {
    containerType: computeContainerType(read(CUSTOM_PROPERTY_TYPE).trim()),
    containerNames: computeContainerNames(read(CUSTOM_PROPERTY_NAME).trim()),
    writingAxis: computeWritingAxis(read('writing-mode').trim()),
    displayFlags: computeDisplayFlags(read('display').trim())
  };
}

function setProperty(styles, name, value) {
  if (value != null) {
    if (value != styles.getPropertyValue(name)) {
      styles.setProperty(name, value);
    }
  } else {
    styles.removeProperty(name);
  }
}

function getDescriptorsForStyleSheet(styleSheet) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = styleSheet[STYLESHEET_SYMBOL];
  return value != null ? value : [];
}

function setDescriptorsForStyleSheet(styleSheet, descriptors) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styleSheet[STYLESHEET_SYMBOL] = descriptors;
}

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
new Promise(resolve => {
});

/**
 * Copyright 2022 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

window.CQPolyfill = {
  version: "1.0.1"
};

if (!('container' in document.documentElement.style)) {
  let updateCallback = () => {
    /* noop */
  };

  initializePolyfill(updateCallback);
}
//# sourceMappingURL=container-query-polyfill.modern.js.map
