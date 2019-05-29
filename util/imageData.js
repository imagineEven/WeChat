let baseUrl='https://s3.cn-north-1.amazonaws.com.cn/personality-assessment';
let EvenPagesIdnex =  {
  introImage: `${baseUrl}/Images/4fcf7acab85ba8aa0a49fab4239bee8f.png`,
  continueImage: `${baseUrl}/Images/4b71730e9dd73ef47aca8269987cc07b.png`,
  resetImage: `${baseUrl}/Images/162679a4f0c0e4f80ba4848eeaadf8fd.png`,
  resetImageBtn: `${baseUrl}/Images/1692f1aa81f116a133aa0df5257cb3cd.png`,
  peopleImage: `${baseUrl}/Images/ed68e062dc37cd46cc1fd5b977da21d7.png`,
  bgImage: `${baseUrl}/Images/d66656b031da88e3f102a9be17c55c3b.png`,
  grassImage: `${baseUrl}/Images/fa62a039c90ad7f209e1b87480705ce6.png`,
  bgSound: `${baseUrl}/Sounds/1efae9978cdd4c123020835b0653c8b2.mp3`,
  clickBtnSound: `${baseUrl}/Sounds/2787972a723caef1f0173a9b1dd4bbe5.mp3`,
  introPepleSound: `${baseUrl}/Sounds/97d7768e036943ebb7c55eb9f5f1c049.mp3`,
  boxImage: `${baseUrl}/Images/08e0ac675b9876e7c3ada9bffe67c442.png`,
  lookResultImage: `${baseUrl}/Images/283f433028555157e437c9989e0b6520.png`
};

let EvenSelectPage = {
  bg: `${baseUrl}/Images/d66656b031da88e3f102a9be17c55c3b.png`,
  bgAblack: `${baseUrl}/Images/79f180d07423b8ef6f18d913b624e253.png`,
  grass: `${baseUrl}/Images/fa62a039c90ad7f209e1b87480705ce6.png`,
  grassAblack: `${baseUrl}/Images/ae2323f719755c90cda1acff5a83ccea.png`,
  boy: `${baseUrl}/Images/98f7675fa92f60b7d0f22a9bc5a63e7f.png`,
  boyAsmile: `${baseUrl}/Images/2af7fe3855ef977b8b5b60de657a9710.png`,
  boyAblack: `${baseUrl}/Images/169489f7fee4852e57e3caf53f6f3fb3.png`,
  girl: `${baseUrl}/Images/ae5af4aee31034213cee3c8de71ab2ac.png`,
  girlAsmile: `${baseUrl}/Images/9504fd4b9661e98ca89c2e286522b6e0.png`,
  girlAblack: `${baseUrl}/Images/5a4e0822cbd2aae2b4cff5d3c36b277e.png`,
  dog: `${baseUrl}/Images/92ea0a46cae1526da3e3fdef1b501f31.png`,
  dogAblack: `${baseUrl}/Images/e908a6c1dec0c9ed6b3614189fc485b0.png`,
  dogAsmile: `${baseUrl}/Images/92ea0a46cae1526da3e3fdef1b501f31.png`,
  cat: `${baseUrl}/Images/5c133d7b367a1e84887e08e3a99575e6.png`,
  catAblack: `${baseUrl}/Images/8b0020ab21bd92d2ca0721f2b875e372.png`,
  catAsmile: `${baseUrl}/Images/3d47a858c20e3099801419e95be8e144.png`,
  speaker: `${baseUrl}/Images/1df08c0aba9800232ec1535846badf92.png`,
  tipBox: `${baseUrl}/Images/2baf7c5b2821ce8bcef5847f2576c7ec.png`,
  micSound: `${baseUrl}/Sounds/a3ab9c7e8186af85ab0bec0007709e7f.mp3`,
  boySound: `${baseUrl}/Sounds/d32252811bafa13ce0a7a99bfbea79a2.mp3`,
  girlSound: `${baseUrl}/Sounds/47fdb1f3d88e1fc9ce4c94430f6e5c02.mp3`,
  dogSound: `${baseUrl}/Sounds/44fdcb4a700fe87becdac10075ce0fae.mp3`,
  catSound: `${baseUrl}/Sounds/aed1c478e7ddba5f72f3647578d052f0.mp3`,
  ageBg: `${baseUrl}/Images/81915ad7595f949f225442473ae1d95a.png`,
  startTest: `${baseUrl}/Images/a799e3f59ac78a324c5acc1c10947b11.png`
};
// 结果页图片
let resultPageImages =  {
  topCoverBg: `${baseUrl}/Images/2bac20002e1c2ac05bff53390e5e3b49.png`,
  middleBg: `${baseUrl}/Images/2c306f35c7f531745da30a72d6831930.png`,
  bottomCoverBg: `${baseUrl}/Images/7fb6cfcd7a18417538aabef6041f2f68.png`,
  // defaultImage: `${baseUrl}/Images/19ff1fb8235031445fdd2e3dc7e3eff7.png`, //上传头像默认图片
  defaultImage: `${baseUrl}/Images/f0f8c73de21441bf7fcd02002540fe0c.png`,
  boyAvatar: `${baseUrl}/Images/9c9cbefd855f37570c04f86cccb6de15.png`,
  girlAvatar: `${baseUrl}/Images/21b0aebb81797f62fe234137dfc916e5.png`,
  savedBg: `${baseUrl}/Images/fd6c6d08479df2faab2660e3cc451aa3.png`,
  savedReportImg: `${baseUrl}/Images/aadb8b4ac3d4eac1ac99e044a2101ac5.png`,
  hrImage: `${baseUrl}/Images/06aa1667df345858ad02ee567c065f25.png`, //分割线图片
  wormInfoImage: `${baseUrl}/Images/2ae50a3701e5612585bff5df194d8126.png`, //信息提示图片
  saveBtnImage: `${baseUrl}/Images/12b1a92215048be994fdac02ca72c7b9.png`,
  shareBtnImage: `${baseUrl}/Images/eca31a8a83fe5d697415db5fe8abb672.png`,
  detailIcon0: `${baseUrl}/Images/98f2e74ce5e5f87c2ebf5d1a2d80a43a.png`,
  detailIconBg0: `${baseUrl}/Images/15b143ff55ca9004b1ea03df9504d84d.png`,
  detailIcon1: `${baseUrl}/Images/0d6df6945bf27f8adb6e2d4b7f5da6c7.png`,
  detailIconBg1: `${baseUrl}/Images/32ce757062166b8db7086fb00b42336d.png`,
  detailIcon2: `${baseUrl}/Images/fc1a4acf3eb28e294c2dd30d41c9ef6b.png`,
  detailIconBg2: `${baseUrl}/Images/6df47cc235e79f6435963d3c61a8d1f0.png`,
  detailIcon3: `${baseUrl}/Images/ec71cf9abe66d386a13171bbf82ff991.png`,
  detailIconBg3: `${baseUrl}/Images/a5cd46e3753bb5a28126db582b85059e.png`,
  detailIcon4: `${baseUrl}/Images/8c2b1638ec94f31c73f1ba59ff211f65.png`,
  detailIconBg4: `${baseUrl}/Images/a4a80a4f5e32dec5b9f6af304effbb6c.png`,
  shareCover: `${baseUrl}/Images/72da89e2185c512ef32e895f6236517e.png`
};

let assessPageImgMap = {
  handImg: `${baseUrl}/Images/8c3233928d36d8335ab2b6820e4cdae1.png`,
  directionImg: `${baseUrl}/Images/04f08f15bbae9e65af5413c713b9b46d.png`,
  btnImg: `${baseUrl}/Images/8529f371fe075324369558b81df2b549.png`,
  optionAImg: `${baseUrl}/Images/3f4d5dcb86795655698ec4a723eb212f.png`,
  optionASelectedImg: `${baseUrl}/Images/e82dae68aebcd8837986b2f19cf48275.png`,
  optionBImg: `${baseUrl}/Images/8a689e690d57f1f0217d100500920fe0.png`,
  optionBSelectedImg: `${baseUrl}/Images/89a5c9fb007d14028f2b69a6f353dd9f.png`,
  optionCImg: `${baseUrl}/Images/97bf2a27bd8089a57c6dc62be3331d78.png`,
  optionCSelectedImg: `${baseUrl}/Images/ba0a67032ae461126952bacf972bc4e1.png`,
  optionDImg: `${baseUrl}/Images/449e8bcb2278e2c1e22cbac89850f8a2.png`,
  optionDSelectedImg: `${baseUrl}/Images/16c256a9fc889661865e686b6886f777.png`,
  optionEImg: `${baseUrl}/Images/668a9fb4c54d040bad0fe08050480301.png`,
  optionESelectedImg: `${baseUrl}/Images/0859434c3ca6cc8ff266657d56f60ba8.png`,
  arrowImg: `${baseUrl}/Images/f9a437fb07e2eb9d4fa28e24505ed93e.gif`
};

export {
  EvenPagesIdnex,
  assessPageImgMap,
  EvenSelectPage,
  resultPageImages
};