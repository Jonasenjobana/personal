# Mincraft场景模拟
- 构造正弦波类似的平面 f(x, z) = sin(x) + sin(z)
    - 场景256*256*256方块空间
    - 确定需要显示的方块值为1
    ```javascript
    const cellSize = 256;
    const cell = new Uint8Array(cellSize * cellSize * cellSize);
    // 函数边界确定在正弦波附近cell 值为1就存mesh
    for (let y = 0; y < cellSize; ++y) {
        for (let z = 0; z < cellSize; ++z) {
          for (let x = 0; x < cellSize; ++x) {
            const height = (Math.sin(x / cellSize * Math.PI * 4) + Math.sin(z / cellSize * Math.PI * 6)) * 20 + cellSize / 2;
            if (height > y && height < y + 1) {
              const offset = y * cellSize * cellSize +
                             z * cellSize +
                             x;
              cell[offset] = 1;
            }
          }
        }
    }

    ```