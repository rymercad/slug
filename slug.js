(function (root) {
  var base64
  if (typeof window === 'undefined') {
    base64 = function (input) {
      return Buffer.from(input).toString('base64')
    }
  } else {
    base64 = function (input) {
      // eslint-disable-next-line no-undef
      return btoa(unescape(encodeURIComponent(input)))
    }
  }

  function slug (string, opts) {
    var result = slugify(string, opts)
    // If output is an empty string, try slug for base64 of string.
    if (result === '') {
      result = slugify(base64(string), opts)
    }
    return result
  }

  function slugify (string, opts) {
    if (typeof string !== 'string') {
      throw new Error('slug() requires a string argument')
    }
    if (typeof opts === 'string') { opts = { replacement: opts } }
    opts = opts || {}
    opts.mode = opts.mode || slug.defaults.mode
    var defaults = slug.defaults.modes[opts.mode]
    var keys = ['replacement', 'multicharmap', 'charmap', 'remove', 'lower']
    for (let key, i = 0, l = keys.length; i < l; i++) {
      key = keys[i]
      opts[key] = (key in opts) ? opts[key] : defaults[key]
    }

    var lengths = []
    for (const key in opts.multicharmap) {
      if (!Object.prototype.hasOwnProperty.call(opts.multicharmap, key)) { continue }

      var len = key.length
      if (lengths.indexOf(len) === -1) { lengths.push(len) }
    }

    var result = ''
    for (let char, i = 0, l = string.length; i < l; i++) {
      char = string[i]
      if (!lengths.some(function (len) {
        var str = string.substr(i, len)
        if (opts.multicharmap[str]) {
          i += len - 1
          char = opts.multicharmap[str]
          return true
        } else return false
      })) {
        if (opts.charmap[char]) {
          char = opts.charmap[char]
        }
      }
      const allowedChars = opts.mode === 'rfc3986' ? /[^\w\s\-.~]/g : /[^A-Za-z0-9\s]/g
      // next line preserves the replacement character in case it is included in allowedChars
      char = char.replace(opts.replacement, ' ')
      char = char.replace(allowedChars, '') // allowed
      if (opts.remove) char = char.replace(opts.remove, '') // add flavour
      result += char
    }
    result = result.trim()
    result = result.replace(/[-\s]+/g, opts.replacement) // convert spaces
    result = result.replace(opts.replacement + '$', '') // remove trailing separator
    if (opts.lower) {
      result = result.toLowerCase()
    }
    return result
  }

  slug.defaults = {
    mode: 'pretty'
  }

  slug.multicharmap = slug.defaults.multicharmap = {
    '<3': 'love', '&&': 'and', '||': 'or', 'w/': 'with'
  }

  // https://github.com/django/django/blob/master/django/contrib/admin/static/admin/js/urlify.js
  slug.charmap = slug.defaults.charmap = {
    // latin
    À: 'A',
    Á: 'A',
    Â: 'A',
    Ã: 'A',
    Ä: 'A',
    Å: 'A',
    Æ: 'AE',
    Ç: 'C',
    È: 'E',
    É: 'E',
    Ê: 'E',
    Ë: 'E',
    Ì: 'I',
    Í: 'I',
    Î: 'I',
    Ï: 'I',
    Ð: 'D',
    Ñ: 'N',
    Ò: 'O',
    Ó: 'O',
    Ô: 'O',
    Õ: 'O',
    Ö: 'O',
    Ő: 'O',
    Ø: 'O',
    Ù: 'U',
    Ú: 'U',
    Û: 'U',
    Ü: 'U',
    Ű: 'U',
    Ý: 'Y',
    Þ: 'TH',
    ß: 'ss',
    à: 'a',
    á: 'a',
    â: 'a',
    ã: 'a',
    ä: 'a',
    å: 'a',
    æ: 'ae',
    ç: 'c',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ð: 'd',
    ñ: 'n',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    õ: 'o',
    ö: 'o',
    ő: 'o',
    ø: 'o',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ü: 'u',
    ű: 'u',
    ý: 'y',
    þ: 'th',
    ÿ: 'y',
    ẞ: 'SS',
    // greek
    α: 'a',
    β: 'b',
    γ: 'g',
    δ: 'd',
    ε: 'e',
    ζ: 'z',
    η: 'h',
    θ: '8',
    ι: 'i',
    κ: 'k',
    λ: 'l',
    μ: 'm',
    ν: 'n',
    ξ: '3',
    ο: 'o',
    π: 'p',
    ρ: 'r',
    σ: 's',
    τ: 't',
    υ: 'y',
    φ: 'f',
    χ: 'x',
    ψ: 'ps',
    ω: 'w',
    ά: 'a',
    έ: 'e',
    ί: 'i',
    ό: 'o',
    ύ: 'y',
    ή: 'h',
    ώ: 'w',
    ς: 's',
    ϊ: 'i',
    ΰ: 'y',
    ϋ: 'y',
    ΐ: 'i',
    Α: 'A',
    Β: 'B',
    Γ: 'G',
    Δ: 'D',
    Ε: 'E',
    Ζ: 'Z',
    Η: 'H',
    Θ: '8',
    Ι: 'I',
    Κ: 'K',
    Λ: 'L',
    Μ: 'M',
    Ν: 'N',
    Ξ: '3',
    Ο: 'O',
    Π: 'P',
    Ρ: 'R',
    Σ: 'S',
    Τ: 'T',
    Υ: 'Y',
    Φ: 'F',
    Χ: 'X',
    Ψ: 'PS',
    Ω: 'W',
    Ά: 'A',
    Έ: 'E',
    Ί: 'I',
    Ό: 'O',
    Ύ: 'Y',
    Ή: 'H',
    Ώ: 'W',
    Ϊ: 'I',
    Ϋ: 'Y',
    // turkish
    ş: 's',
    Ş: 'S',
    ı: 'i',
    İ: 'I',
    ğ: 'g',
    Ğ: 'G',
    // russian
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sh',
    ъ: 'u',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    А: 'A',
    Б: 'B',
    В: 'V',
    Г: 'G',
    Д: 'D',
    Е: 'E',
    Ё: 'Yo',
    Ж: 'Zh',
    З: 'Z',
    И: 'I',
    Й: 'J',
    К: 'K',
    Л: 'L',
    М: 'M',
    Н: 'N',
    О: 'O',
    П: 'P',
    Р: 'R',
    С: 'S',
    Т: 'T',
    У: 'U',
    Ф: 'F',
    Х: 'H',
    Ц: 'C',
    Ч: 'Ch',
    Ш: 'Sh',
    Щ: 'Sh',
    Ъ: 'U',
    Ы: 'Y',
    Ь: '',
    Э: 'E',
    Ю: 'Yu',
    Я: 'Ya',
    // ukranian
    Є: 'Ye',
    І: 'I',
    Ї: 'Yi',
    Ґ: 'G',
    є: 'ye',
    і: 'i',
    ї: 'yi',
    ґ: 'g',
    // czech
    č: 'c',
    ď: 'd',
    ě: 'e',
    ň: 'n',
    ř: 'r',
    š: 's',
    ť: 't',
    ů: 'u',
    ž: 'z',
    Č: 'C',
    Ď: 'D',
    Ě: 'E',
    Ň: 'N',
    Ř: 'R',
    Š: 'S',
    Ť: 'T',
    Ů: 'U',
    Ž: 'Z',
    // polish
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ś: 's',
    ź: 'z',
    ż: 'z',
    Ą: 'A',
    Ć: 'C',
    Ę: 'E',
    Ł: 'L',
    Ń: 'N',
    Ś: 'S',
    Ź: 'Z',
    Ż: 'Z',
    // latvian
    ā: 'a',
    ē: 'e',
    ģ: 'g',
    ī: 'i',
    ķ: 'k',
    ļ: 'l',
    ņ: 'n',
    ū: 'u',
    Ā: 'A',
    Ē: 'E',
    Ģ: 'G',
    Ī: 'I',
    Ķ: 'K',
    Ļ: 'L',
    Ņ: 'N',
    Ū: 'U',
    // arabic
    أ: 'a',
    ب: 'b',
    ت: 't',
    ث: 'th',
    ج: 'g',
    ح: 'h',
    خ: 'kh',
    د: 'd',
    ذ: 'th',
    ر: 'r',
    ز: 'z',
    س: 's',
    ش: 'sh',
    ص: 's',
    ض: 'd',
    ط: 't',
    ظ: 'th',
    ع: 'aa',
    غ: 'gh',
    ف: 'f',
    ق: 'k',
    ك: 'k',
    ل: 'l',
    م: 'm',
    ن: 'n',
    ه: 'h',
    و: 'o',
    ي: 'y',
    // farsi
    آ: 'a',
    ا: 'a',
    پ: 'p',
    ژ: 'zh',
    گ: 'g',
    چ: 'ch',
    ک: 'k',
    ی: 'i',
    // lithuanian
    ė: 'e',
    į: 'i',
    ų: 'u',
    Ė: 'E',
    Į: 'I',
    Ų: 'U',
    // romanian
    ț: 't',
    Ț: 'T',
    ţ: 't',
    Ţ: 'T',
    ș: 's',
    Ș: 'S',
    ă: 'a',
    Ă: 'A',
    // vietnamese
    Ạ: 'A',
    Ả: 'A',
    Ầ: 'A',
    Ấ: 'A',
    Ậ: 'A',
    Ẩ: 'A',
    Ẫ: 'A',
    Ằ: 'A',
    Ắ: 'A',
    Ặ: 'A',
    Ẳ: 'A',
    Ẵ: 'A',
    Ẹ: 'E',
    Ẻ: 'E',
    Ẽ: 'E',
    Ề: 'E',
    Ế: 'E',
    Ệ: 'E',
    Ể: 'E',
    Ễ: 'E',
    Ị: 'I',
    Ỉ: 'I',
    Ĩ: 'I',
    Ọ: 'O',
    Ỏ: 'O',
    Ồ: 'O',
    Ố: 'O',
    Ộ: 'O',
    Ổ: 'O',
    Ỗ: 'O',
    Ơ: 'O',
    Ờ: 'O',
    Ớ: 'O',
    Ợ: 'O',
    Ở: 'O',
    Ỡ: 'O',
    Ụ: 'U',
    Ủ: 'U',
    Ũ: 'U',
    Ư: 'U',
    Ừ: 'U',
    Ứ: 'U',
    Ự: 'U',
    Ử: 'U',
    Ữ: 'U',
    Ỳ: 'Y',
    Ỵ: 'Y',
    Ỷ: 'Y',
    Ỹ: 'Y',
    Đ: 'D',
    ạ: 'a',
    ả: 'a',
    ầ: 'a',
    ấ: 'a',
    ậ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ằ: 'a',
    ắ: 'a',
    ặ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    ẹ: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ề: 'e',
    ế: 'e',
    ệ: 'e',
    ể: 'e',
    ễ: 'e',
    ị: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ọ: 'o',
    ỏ: 'o',
    ồ: 'o',
    ố: 'o',
    ộ: 'o',
    ổ: 'o',
    ỗ: 'o',
    ơ: 'o',
    ờ: 'o',
    ớ: 'o',
    ợ: 'o',
    ở: 'o',
    ỡ: 'o',
    ụ: 'u',
    ủ: 'u',
    ũ: 'u',
    ư: 'u',
    ừ: 'u',
    ứ: 'u',
    ự: 'u',
    ử: 'u',
    ữ: 'u',
    ỳ: 'y',
    ỵ: 'y',
    ỷ: 'y',
    ỹ: 'y',
    đ: 'd',
    // kazakh
    Ә: 'AE',
    ә: 'ae',
    Ғ: 'GH',
    ғ: 'gh',
    Қ: 'KH',
    қ: 'kh',
    Ң: 'NG',
    ң: 'ng',
    Ү: 'UE',
    ү: 'ue',
    Ұ: 'U',
    ұ: 'u',
    Һ: 'H',
    һ: 'h',
    Ө: 'OE',
    ө: 'oe',
    // serbian
    ђ: 'dj',
    ј: 'j',
    љ: 'lj',
    њ: 'nj',
    ћ: 'c',
    џ: 'dz',
    Ђ: 'Dj',
    Ј: 'j',
    Љ: 'Lj',
    Њ: 'Nj',
    Ћ: 'C',
    Џ: 'Dz',
    ǌ: 'nj',
    ǉ: 'lj',
    ǋ: 'NJ',
    ǈ: 'LJ',
    // currency
    '€': 'euro',
    '₢': 'cruzeiro',
    '₣': 'french franc',
    '£': 'pound',
    '₤': 'lira',
    '₥': 'mill',
    '₦': 'naira',
    '₧': 'peseta',
    '₨': 'rupee',
    '₩': 'won',
    '₪': 'new shequel',
    '₫': 'dong',
    '₭': 'kip',
    '₮': 'tugrik',
    '₯': 'drachma',
    '₰': 'penny',
    '₱': 'peso',
    '₲': 'guarani',
    '₳': 'austral',
    '₴': 'hryvnia',
    '₵': 'cedi',
    '¢': 'cent',
    '¥': 'yen',
    元: 'yuan',
    円: 'yen',
    '﷼': 'rial',
    '₠': 'ecu',
    '¤': 'currency',
    '฿': 'baht',
    $: 'dollar',
    '₹': 'indian rupee',
    '₽': 'russian ruble',
    '₿': 'bitcoin',
    '₸': 'kazakhstani tenge',
    // symbols
    '©': 'c',
    œ: 'oe',
    Œ: 'OE',
    '∑': 'sum',
    '®': 'r',
    '∂': 'd',
    ƒ: 'f',
    '™': 'tm',
    '℠': 'sm',
    '…': '...',
    '˚': 'o',
    º: 'o',
    ª: 'a',
    '∆': 'delta',
    '∞': 'infinity',
    '♥': 'love',
    '&': 'and',
    '|': 'or',
    '<': 'less',
    '>': 'greater'
  }

  slug.extend = function (customMap) {
    Object.assign(slug.charmap, customMap)
  }

  slug.defaults.modes = {
    rfc3986: {
      replacement: '-',
      remove: null,
      lower: true,
      charmap: slug.defaults.charmap,
      multicharmap: slug.defaults.multicharmap
    },
    pretty: {
      replacement: '-',
      remove: /[.]/g,
      lower: true,
      charmap: slug.defaults.charmap,
      multicharmap: slug.defaults.multicharmap
    }
  }

  /* global define */
  // Be compatible with different module systems

  if (typeof define !== 'undefined' && define.amd) { // AMD
    define([], function () { return slug })
  } else if (typeof module !== 'undefined' && module.exports) { // CommonJS
    module.exports = slug
  } else { // Script tag
    root.slug = slug
  }
}(this))
