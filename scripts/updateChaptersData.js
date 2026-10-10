import fs from 'node:fs';

let code = fs.readFileSync('src/data/chaptersData.js', 'utf8');

for (let i = 1; i <= 15; i++) {
  const target = `imageUrl: "assets/textbook/ch${i}_p2.png",`;
  const repl = `imageUrl: "assets/pixar/ch${i}_3d.jpg",\n    textbookUrl: "assets/textbook/ch${i}_p2.png",\n    audioUrlMal: "assets/audio/ch${i}_mal.mp3",\n    audioUrlEng: "assets/audio/ch${i}_eng.mp3",`;
  code = code.replace(target, repl);
}

fs.writeFileSync('src/data/chaptersData.js', code, 'utf8');
console.log('Successfully updated chaptersData.js with static 3D Pixar images and static MP3 audio URLs!');
