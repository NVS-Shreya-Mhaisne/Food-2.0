const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = 'd:/Food 2.0/Frontend/src/assets/Menu/north.png';
const outputPath = 'd:/Food 2.0/Frontend/src/assets/Menu/north.png';

fs.createReadStream(inputPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    console.log(`Image dimensions: ${this.width} x ${this.height}`);

    // Print sample corner pixels to see exact background RGB values
    for (let y = 0; y < 10; y++) {
      let line = '';
      for (let x = 0; x < 10; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];
        const a = this.data[idx + 3];
        line += `(${r},${g},${b},${a}) `;
      }
      console.log(`Row ${y}: ${line}`);
    }

    // Flood fill from edges to remove checkered background
    const visited = new Uint8Array(this.width * this.height);
    const queue = [];

    const isCheckeredBg = (r, g, b, a) => {
      if (a < 10) return true; // already transparent
      const diff = Math.max(r, g, b) - Math.min(r, g, b);
      // Checkered backgrounds are neutral gray/white (low color saturation, high brightness)
      const isNeutral = diff < 20;
      const isBright = r > 120 && g > 120 && b > 120;
      return isNeutral && isBright;
    };

    // Add border pixels to queue
    for (let x = 0; x < this.width; x++) {
      queue.push([x, 0]);
      queue.push([x, this.height - 1]);
    }
    for (let y = 0; y < this.height; y++) {
      queue.push([0, y]);
      queue.push([this.width - 1, y]);
    }

    let removedCount = 0;

    while (queue.length > 0) {
      const [x, y] = queue.pop();
      if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;
      
      const pos = y * this.width + x;
      if (visited[pos]) continue;
      visited[pos] = 1;

      const idx = pos << 2;
      const r = this.data[idx];
      const g = this.data[idx + 1];
      const b = this.data[idx + 2];
      const a = this.data[idx + 3];

      if (isCheckeredBg(r, g, b, a)) {
        // Set transparent
        this.data[idx + 3] = 0;
        removedCount++;

        // Add 4 neighbors
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }

    console.log(`Removed ${removedCount} background pixels out of ${this.width * this.height}`);

    this.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
      console.log('Background removal complete!');
    });
  });
