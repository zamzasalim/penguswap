(function (_0x310e35, _0x35f040) {
  const _0x535114 = a0_0x3880,
    _0x21e1f3 = _0x310e35();
  while (!![]) {
    try {
      const _0x3b4266 =
        -parseInt(_0x535114(0xff)) / 0x1 +
        (parseInt(_0x535114(0xfe)) / 0x2) * (parseInt(_0x535114(0x108)) / 0x3) +
        -parseInt(_0x535114(0x101)) / 0x4 +
        -parseInt(_0x535114(0x105)) / 0x5 +
        (parseInt(_0x535114(0x106)) / 0x6) *
          (parseInt(_0x535114(0x104)) / 0x7) +
        -parseInt(_0x535114(0x10b)) / 0x8 +
        parseInt(_0x535114(0x100)) / 0x9;
      if (_0x3b4266 === _0x35f040) break;
      else _0x21e1f3["push"](_0x21e1f3["shift"]());
    } catch (_0x182cc2) {
      _0x21e1f3["push"](_0x21e1f3["shift"]());
    }
  }
})(a0_0xf7f9, 0xd928a);
function a0_0xf7f9() {
  const _0x1039c8 = [
    "runProcess",
    "accounts",
    "7848752JRqudT",
    "getBalance",
    "exit",
    "2AiTqnk",
    "1165124KybIPA",
    "15002712FgbSAP",
    "3667888GLGJAd",
    "error",
    "length",
    "120029wqXxaA",
    "3427970FFXvEx",
    "498sitxtu",
    "Please\x20set\x20up\x20accounts.js\x20first",
    "4644291oXgajK",
  ];
  a0_0xf7f9 = function () {
    return _0x1039c8;
  };
  return a0_0xf7f9();
}
import a0_0x3a2a6b from "./setup.js";
function a0_0x3880(_0x42a763, _0x2fd293) {
  const _0xf7f991 = a0_0xf7f9();
  return (
    (a0_0x3880 = function (_0x388021, _0x6335f7) {
      _0x388021 = _0x388021 - 0xfc;
      let _0x56e9a = _0xf7f991[_0x388021];
      return _0x56e9a;
    }),
    a0_0x3880(_0x42a763, _0x2fd293)
  );
}
import a0_0xc2ae1b from "./src/core/core.js";
async function operateAccount(_0x27452d) {
  const _0x82ced2 = a0_0x3880,
    _0x5b6505 = new a0_0xc2ae1b(_0x27452d);
  try {
    await _0x5b6505[_0x82ced2(0xfc)](!![]), await _0x5b6505[_0x82ced2(0x109)]();
  } catch (_0x753c1d) {
    console[_0x82ced2(0x102)](_0x753c1d), process[_0x82ced2(0xfd)](0x1);
  }
}
(async () => {
  const _0x10f05e = a0_0x3880;
  if (
    !Array["isArray"](a0_0x3a2a6b[_0x10f05e(0x10a)]) ||
    a0_0x3a2a6b["accounts"][_0x10f05e(0x103)] < 0x1
  )
    throw new Error(_0x10f05e(0x107));
  for (const _0x55c5b of a0_0x3a2a6b[_0x10f05e(0x10a)]) {
    operateAccount(_0x55c5b)["catch"]((_0x356d0c) => {
      const _0xcd9304 = _0x10f05e;
      console["error"](_0x356d0c), process[_0xcd9304(0xfd)](0x1);
    });
  }
})();
