const a0_0x838864=a0_0x1351;(function(_0x9c3773,_0x50e00a){const _0x1816fb=a0_0x1351,_0x35854b=_0x9c3773();while(!![]){try{const _0x84ab46=-parseInt(_0x1816fb(0x1ea))/0x1*(parseInt(_0x1816fb(0x21d))/0x2)+parseInt(_0x1816fb(0x220))/0x3+parseInt(_0x1816fb(0x246))/0x4*(-parseInt(_0x1816fb(0x1f0))/0x5)+parseInt(_0x1816fb(0x209))/0x6+-parseInt(_0x1816fb(0x218))/0x7*(parseInt(_0x1816fb(0x1e8))/0x8)+parseInt(_0x1816fb(0x1f8))/0x9*(-parseInt(_0x1816fb(0x200))/0xa)+-parseInt(_0x1816fb(0x22b))/0xb*(-parseInt(_0x1816fb(0x1f3))/0xc);if(_0x84ab46===_0x50e00a)break;else _0x35854b['push'](_0x35854b['shift']());}catch(_0x39fdef){_0x35854b['push'](_0x35854b['shift']());}}}(a0_0x452e,0x5905a));import{ethers}from'ethers';import a0_0x43b2c7 from'../../setup.js';import{WCTC_ABI,ERC20_ABI,ROUTER_ABI,POSITION_ABI,FACTORY_ABI}from'../abi/abi.js';import{Helper}from'../utils/helper.js';import a0_0x4fccce from'../utils/twister.js';import a0_0xb1e2a2 from'./service/deployManager.js';import a0_0x885741 from'./service/tokenManager.js';import a0_0x141eb5 from'./service/addLiquidityManager.js';function a0_0x1351(_0x484ae4,_0x3abf5e){const _0x452e1c=a0_0x452e();return a0_0x1351=function(_0x13512c,_0x19e9e4){_0x13512c=_0x13512c-0x1e5;let _0x24cade=_0x452e1c[_0x13512c];return _0x24cade;},a0_0x1351(_0x484ae4,_0x3abf5e);}import a0_0x43181f from'./service/serviceManager.js';import a0_0x468f18 from'./service/swapManager.js';function a0_0x452e(){const _0x31c303=['deployPool','🔄\x20','addLiquidityManager','248787xobHdf','decimals','POSITION_MANAGER_ADDRESS','Contract\x20address\x20is\x20zero\x20address','Wrapping\x20','✔️\x20\x20Already\x20approved!','processWCTC','parseUnits','50iOumjn','name','gasPrice','Preparing\x20to\x20swap\x20','address','\x1b[0m','POSITION_MANAGER','exit','all','912804HzgZey','formatEther','Unwrapping\x20','approveToken','walletInstance','processApprove','fetchTokenDetails','\x1b[0m\x20Into\x20\x1b[1m','sleep','Error\x20during\x20process\x20execution:','FIXED_GAS_PRICE','JsonRpcProvider','message','deployToken','Error\x20fetching\x20positions:','14AdqwTF','encodePriceSqrt','gwei','Process\x20has\x20completed\x20successfully\x20for\x20address:\x20','log','1370658QhmpdK','initializeContracts','token','509154mCcsAa','\x1b[0m\x20token.','\x20and\x20100\x20','ROUTER','collectFee','getBalance','swapManager','MaxUint256','USDC_ADDRESS','getAddress','formatUnits','110286nCydWq','\x20WCTC\x20into\x20CTC','Preparing\x20to\x20','Accounts\x20are\x20required','swapToken','\x20Into\x20','Deploying\x20Liquidity\x20Pool\x20Contract\x20for\x20','runProcess','tokenManager','🔨\x20\x20','symbol','No\x20approval\x20needed\x20for\x20\x1b[1m','url','✔️\x20\x20All\x20process\x20has\x20been\x20completed.','deployContract','delay','Swaping\x20\x1b[1m','contracts','🔨\x20Deploying\x20contract\x20\x1b[1m','\x20CTC\x20into\x20WCTC','error','WCTC','accounts','WCTC_ADDRESS','handleError','serviceManager','\x20to\x20pool.','712NxcytS','❌\x20Error:\x20','toFixed','deployTokenManager','wrap','reduce','checkAllowance','performSwap','ZERO_ADDRESS','getPositions','gasLimit','Contract','1487144iDIVhR','toString','1bRplXz','CONTRACT_ADDRESS','positions','addLiquidity','showSkelLogo','Wallet','2115aDhQWN','tokenOfOwnerByIndex','0x0000000000000000000000000000000000000000','1572TrTiCf','provider'];a0_0x452e=function(){return _0x31c303;};return a0_0x452e();}export default class Core{constructor(_0x5c8c89){const _0x1f47fa=a0_0x1351;if(!_0x5c8c89)throw new Error(_0x1f47fa(0x22e));const {rpc:_0x44f76d,gasSetting:_0xddaeae,constant:_0x44e639}=a0_0x43b2c7;this[_0x1f47fa(0x1f4)]=new ethers[(_0x1f47fa(0x214))](_0x44f76d[_0x1f47fa(0x237)]),this[_0x1f47fa(0x241)]=_0x5c8c89,this['ZERO_ADDRESS']=_0x1f47fa(0x1f2),this['CONTRACT_ADDRESS']=_0x44e639,this[_0x1f47fa(0x20d)]=new ethers[(_0x1f47fa(0x1ef))](_0x5c8c89,this['provider']),this[_0x1f47fa(0x204)]=Helper['validateAddress'](this[_0x1f47fa(0x20d)]['address']),this['FIXED_GAS_LIMIT']=_0xddaeae[_0x1f47fa(0x1e6)],this[_0x1f47fa(0x213)]=ethers[_0x1f47fa(0x1ff)](_0xddaeae[_0x1f47fa(0x202)][_0x1f47fa(0x1e9)](),_0x1f47fa(0x21a)),this[_0x1f47fa(0x244)]=new a0_0x43181f(this),this[_0x1f47fa(0x249)]=new a0_0xb1e2a2(this),this[_0x1f47fa(0x233)]=new a0_0x885741(this,this[_0x1f47fa(0x244)]),this[_0x1f47fa(0x226)]=new a0_0x468f18(this,this['serviceManager']),this[_0x1f47fa(0x1f7)]=new a0_0x141eb5(this,this['serviceManager']),this[_0x1f47fa(0x23c)]=this[_0x1f47fa(0x21e)](_0x44e639);}[a0_0x838864(0x21e)](_0x3e013a){const _0x7b7cfb=a0_0x838864,{WCTC_ADDRESS:_0x3a19de,ROUTER_ADDRESS:_0x41afc0,USDC_ADDRESS:_0xb14d21,FACTORY_ADDRESS:_0x5a349b,POSITION_MANAGER_ADDRESS:_0x1fed7a}=_0x3e013a,_0x55bc29=[{'name':_0x7b7cfb(0x240),'address':_0x3a19de,'abi':WCTC_ABI},{'name':_0x7b7cfb(0x223),'address':_0x41afc0,'abi':ROUTER_ABI},{'name':'USDC','address':_0xb14d21,'abi':ERC20_ABI},{'name':'FACTORY','address':_0x5a349b,'abi':FACTORY_ABI},{'name':_0x7b7cfb(0x206),'address':_0x1fed7a,'abi':POSITION_ABI}];return _0x55bc29[_0x7b7cfb(0x24b)]((_0x725c6d,{name:_0x15ddd5,address:_0x541343,abi:_0x187197})=>{const _0xf13780=_0x7b7cfb;return _0x725c6d[_0x15ddd5]=new ethers['Contract'](_0x541343,_0x187197,this[_0xf13780(0x20d)]),_0x725c6d;},{});}async[a0_0x838864(0x225)](_0x186da1=![]){const _0x451570=a0_0x838864;try{const _0x137978=await this['provider'][_0x451570(0x225)](this[_0x451570(0x204)]);if(_0x186da1)this['balance']=_0x137978[_0x451570(0x1e9)]();return ethers[_0x451570(0x20a)](_0x137978);}catch(_0x39c5ac){this[_0x451570(0x243)]('Failed\x20fetching\x20balance',_0x39c5ac['message']);}}async[a0_0x838864(0x216)](_0x2a0700,_0x44ecdc,_0x4d6c41){const _0x54b168=a0_0x838864;try{const _0x1e54f9=await this[_0x54b168(0x249)][_0x54b168(0x239)](_0x2a0700,_0x44ecdc,_0x4d6c41);if(_0x1e54f9===this[_0x54b168(0x24e)]){console[_0x54b168(0x21c)](_0x1e54f9);throw new Error(_0x54b168(0x1fb));}const _0x217d15=_0x54b168(0x23d)+_0x2a0700+'\x20('+_0x44ecdc+')\x1b[0m';return a0_0x4fccce[_0x54b168(0x21c)](_0x217d15,this['accounts'],this,'✔️\x20\x20Contract\x20deployed\x20successfully\x20at\x20\x1b[1m'+_0x1e54f9),await this[_0x54b168(0x211)](0xbb8),_0x1e54f9;}catch(_0x3e6cc8){console[_0x54b168(0x23f)](_0x3e6cc8),this[_0x54b168(0x243)](action,_0x3e6cc8[_0x54b168(0x215)]);}}async[a0_0x838864(0x1fe)](_0x4529a5,_0x718572=![]){const _0x4008fb=a0_0x838864,_0x538bbb=_0x718572===_0x4008fb(0x24a);_0x4529a5=_0x538bbb?_0x4529a5:await this[_0x4008fb(0x23c)][_0x4008fb(0x240)]['balanceOf'](this[_0x4008fb(0x204)]);const _0x2d03e3=_0x538bbb?_0x4008fb(0x1fc)+Number(_0x4529a5)[_0x4008fb(0x248)](0x8)+_0x4008fb(0x23e):_0x4008fb(0x20b)+Number(ethers[_0x4008fb(0x22a)](_0x4529a5[_0x4008fb(0x1e9)](),0x12))[_0x4008fb(0x248)](0x8)+_0x4008fb(0x22c);return await Helper['delay'](0x1388,this['accounts'],this,_0x4008fb(0x1f6)+_0x2d03e3,'Preparing\x20to\x20'+_0x2d03e3),await this[_0x4008fb(0x233)][_0x4008fb(0x24a)](_0x4529a5,_0x718572);}async[a0_0x838864(0x20f)](_0x2d3bcb){const _0x4a1ff3=a0_0x838864,_0x1e90e6=new ethers[(_0x4a1ff3(0x1e7))](_0x2d3bcb,ERC20_ABI,this[_0x4a1ff3(0x20d)]),[_0x1f4845,_0x2f9cd9,_0x3643e1]=await Promise['all']([_0x1e90e6['symbol'](),_0x1e90e6[_0x4a1ff3(0x201)](),_0x1e90e6[_0x4a1ff3(0x1f9)]()]);return{'symbol':_0x1f4845,'name':_0x2f9cd9,'decimal':_0x3643e1};}async['processApprove'](_0xd5e4de,_0x27e8a3){const _0x4c231d=a0_0x838864,{symbol:_0x183162,name:_0x491906}=await this[_0x4c231d(0x20f)](_0xd5e4de),_0xc0adef='Approving\x20\x1b[1m'+_0x183162+'\x1b[0m\x20Into\x20'+_0x27e8a3;await Helper['delay'](0x1388,this['accounts'],this,_0x4c231d(0x1f6)+_0xc0adef,'Preparing\x20to\x20approve\x20\x1b[1m'+_0x183162+_0x4c231d(0x205));const _0x45b0eb=await this[_0x4c231d(0x233)][_0x4c231d(0x24c)](_0xd5e4de,ethers[_0x4c231d(0x229)](_0x27e8a3),this[_0x4c231d(0x204)]);if(_0x45b0eb[_0x4c231d(0x1e9)]()===ethers[_0x4c231d(0x227)][_0x4c231d(0x1e9)]()){const _0x1e1101=_0x4c231d(0x236)+_0x183162+_0x4c231d(0x221);return a0_0x4fccce[_0x4c231d(0x21c)](_0x1e1101,this[_0x4c231d(0x241)],this,_0x4c231d(0x1fd));}return await this[_0x4c231d(0x225)](!![]),this['tokenManager'][_0x4c231d(0x20c)](_0xd5e4de,_0x27e8a3);}async[a0_0x838864(0x1f5)](_0x2d0c41,_0x3d5f7a,_0x39ebc3,_0x38c5d8){const _0x3c2de1=a0_0x838864,[_0x44031d,_0x276b2b]=await Promise[_0x3c2de1(0x208)]([this[_0x3c2de1(0x20f)](_0x2d0c41),this['fetchTokenDetails'](_0x3d5f7a)]),_0x454782=_0x3c2de1(0x231)+_0x44031d[_0x3c2de1(0x235)]+'/'+_0x276b2b['symbol'];await Helper[_0x3c2de1(0x23a)](0x1388,this[_0x3c2de1(0x241)],this,_0x3c2de1(0x234)+_0x454782,_0x3c2de1(0x22d)+_0x454782);const _0xd9be7a=await this[_0x3c2de1(0x1f7)][_0x3c2de1(0x1f5)](_0x2d0c41,_0x3d5f7a,_0x39ebc3,_0x38c5d8);if(_0xd9be7a===this[_0x3c2de1(0x24e)])return a0_0x4fccce[_0x3c2de1(0x21c)](_0x454782,this[_0x3c2de1(0x241)],this,'❌\x20Failed\x20to\x20'+_0x454782),process[_0x3c2de1(0x207)](0x1);return await this[_0x3c2de1(0x225)](!![]),_0xd9be7a;}async['addLiquidity'](_0x54ed1a,_0x13f40a,_0x3dece){const _0x52d700=a0_0x838864,[_0x4a6040,_0x3a74cb]=await Promise['all']([this[_0x52d700(0x20f)](_0x54ed1a),this[_0x52d700(0x20f)](_0x13f40a)]),_0xdfc0a2='Adding\x20100\x20'+_0x4a6040[_0x52d700(0x235)]+_0x52d700(0x222)+_0x3a74cb[_0x52d700(0x235)]+_0x52d700(0x245);return await Helper[_0x52d700(0x23a)](0x1388,this[_0x52d700(0x241)],this,_0x52d700(0x234)+_0xdfc0a2,_0x52d700(0x22d)+_0xdfc0a2),await this[_0x52d700(0x225)](!![]),await this[_0x52d700(0x1f7)][_0x52d700(0x1ed)](_0x54ed1a,_0x13f40a,_0x3dece);}async['performSwap'](_0x390299,_0xa2bc36,_0x4fd5fb,_0x2c3fff,_0x2e2018){const _0x28c11a=a0_0x838864,[_0x40c5c,_0x516da6]=await Promise[_0x28c11a(0x208)]([this[_0x28c11a(0x20f)](_0xa2bc36),this[_0x28c11a(0x20f)](_0x4fd5fb)]),_0x3d24ed=_0x28c11a(0x23b)+_0x40c5c[_0x28c11a(0x235)]+_0x28c11a(0x210)+_0x516da6[_0x28c11a(0x235)]+_0x28c11a(0x205);return await Helper['delay'](0x1388,this['accounts'],this,_0x28c11a(0x1f6)+_0x3d24ed,_0x28c11a(0x203)+_0x40c5c[_0x28c11a(0x235)]+_0x28c11a(0x230)+_0x516da6['symbol']),await this['getBalance'](!![]),await this['swapManager'][_0x28c11a(0x22f)](_0xa2bc36,_0x4fd5fb,_0x390299,_0x2c3fff,_0x2e2018);}async[a0_0x838864(0x1e5)](){const _0x19abf6=a0_0x838864,{POSITION_MANAGER:_0x32b4e9}=this[_0x19abf6(0x23c)];try{const _0x40e2d9=await _0x32b4e9['balanceOf'](this[_0x19abf6(0x204)]);for(let _0x4f59ff=0x0;_0x4f59ff<_0x40e2d9;_0x4f59ff++){const _0x1b1248=await _0x32b4e9[_0x19abf6(0x1f1)](this[_0x19abf6(0x204)],_0x4f59ff),{feeGrowthInside0LastX128:_0x270190,feeGrowthInside1LastX128:_0x557712}=await _0x32b4e9[_0x19abf6(0x1ec)](_0x1b1248),_0x44f527='Collecting\x20fee\x20for\x20positionId\x20'+_0x1b1248['toString']();_0x557712>BigInt(0x0)||_0x270190>BigInt(0x0)?(await Helper[_0x19abf6(0x23a)](0x1388,this[_0x19abf6(0x241)],this,_0x44f527,_0x19abf6(0x22d)+_0x44f527),await this[_0x19abf6(0x1f7)][_0x19abf6(0x224)](_0x1b1248)):a0_0x4fccce['log'](_0x44f527,this['accounts'],this,'❌\x20No\x20fees\x20to\x20collect\x20for\x20positionId\x20'+_0x1b1248[_0x19abf6(0x1e9)]());}}catch(_0x214d90){this[_0x19abf6(0x243)](_0x19abf6(0x217),_0x214d90[_0x19abf6(0x215)]);}}async[a0_0x838864(0x232)](){const _0x2cc391=a0_0x838864;try{Helper[_0x2cc391(0x1ee)](),await this[_0x2cc391(0x211)](0xbb8);const _0x3001ae=await this[_0x2cc391(0x216)](a0_0x43b2c7['token'][_0x2cc391(0x201)],a0_0x43b2c7['token']['symbol'],a0_0x43b2c7[_0x2cc391(0x21f)]['supply']);await this[_0x2cc391(0x211)](0xbb8),await this[_0x2cc391(0x1fe)](a0_0x43b2c7['liquidityPool0'][_0x2cc391(0x1e9)](),_0x2cc391(0x24a)),await this[_0x2cc391(0x211)](0xbb8);const _0x76e06d=[[this[_0x2cc391(0x1eb)][_0x2cc391(0x242)],this['CONTRACT_ADDRESS']['POSITION_MANAGER_ADDRESS']],[_0x3001ae,this['CONTRACT_ADDRESS'][_0x2cc391(0x1fa)]]];for(const _0x3afde9 of _0x76e06d)await this[_0x2cc391(0x20e)](..._0x3afde9);await this['sleep'](0xbb8),await this[_0x2cc391(0x1f5)](this[_0x2cc391(0x1eb)][_0x2cc391(0x242)],_0x3001ae,0xbb8,this[_0x2cc391(0x1f7)][_0x2cc391(0x219)](0x1,0x1)),await this['sleep'](0xbb8),await this[_0x2cc391(0x1f7)][_0x2cc391(0x1ed)](this[_0x2cc391(0x1eb)][_0x2cc391(0x242)],_0x3001ae,0xbb8),await this[_0x2cc391(0x211)](0xbb8);const _0x2eb7b8=[['10',this[_0x2cc391(0x1eb)][_0x2cc391(0x242)],this[_0x2cc391(0x1eb)]['USDC_ADDRESS'],0x1f4,![]],['0',this[_0x2cc391(0x1eb)][_0x2cc391(0x228)],this['CONTRACT_ADDRESS'][_0x2cc391(0x242)],0x1f4,!![]],['10',this[_0x2cc391(0x1eb)][_0x2cc391(0x242)],_0x3001ae,0xbb8,![]]];for(const _0x475672 of _0x2eb7b8){await this[_0x2cc391(0x24d)](..._0x475672),await this[_0x2cc391(0x211)](0xbb8);}await this[_0x2cc391(0x1fe)]('0',![]),await this['sleep'](0xbb8),await this['getPositions'](),await this[_0x2cc391(0x225)](!![]),a0_0x4fccce[_0x2cc391(0x21c)](_0x2cc391(0x21b)+this['address'],this['accounts'],this,_0x2cc391(0x238));}catch(_0x43f998){this[_0x2cc391(0x243)](_0x2cc391(0x212),_0x43f998[_0x2cc391(0x215)]),process['exit'](0x1);}}async[a0_0x838864(0x243)](_0x597b17,_0x22f06a){const _0x59c9d4=a0_0x838864;a0_0x4fccce[_0x59c9d4(0x21c)](_0x597b17,this[_0x59c9d4(0x241)],this,_0x59c9d4(0x247)+_0x22f06a),await this['sleep'](0xdac);}[a0_0x838864(0x211)](_0x45bc59){return new Promise(_0x351f0b=>setTimeout(_0x351f0b,_0x45bc59));}}