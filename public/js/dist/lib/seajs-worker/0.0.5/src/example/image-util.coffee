define (require, exports, module) ->
  # Image Data
  ImageData::n8 = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]
  ImageData::n4 = [[0, -1], [-1, 0], [1, 0], [0, 1]]

  ImageData::get_n = (x, y, delta) ->
    N = []
    for d in delta
      nx = x + d[0]
      ny = y + d[1]
      ni = (ny * @width + nx) * 4
      if nx < 0 or ny < 0 or nx >= @width or ny >= @height then continue
      N.push
        i: ni
        x: nx
        y: ny
    return N

  ImageData::get_n4 = (x, y) -> @get_n x, y, @n4
  ImageData::get_n8 = (x, y) -> @get_n x, y, @n8

  ImageData::setRGBA = (i, r, g, b, a) ->
    i = i - i % 4
    @data[i] = r
    @data[i + 1] = g
    @data[i + 2] = b
    @data[i + 3] = a

  ImageData::each = (callback) ->
    data = @data
    for y in [0..@height]
      for x in [0..@width]
        i = (y * @width + x) * 4
        pixel =
          i: i
          x: x
          y: y
          r: data[i]
          g: data[i + 1]
          b: data[i + 2]
          a: data[i + 3]
        callback?(pixel)

  ImageData::each_n8 = (callback) ->
    data = @data
    for y in [0..@height]
      for x in [0..@width]
        i = (y * @width + x) * 4
        pixel =
          i: i
          x: x
          y: y
          r: data[i]
          g: data[i + 1]
          b: data[i + 2]
          a: data[i + 3]

        N = []
        for d in @n8
          nx = x + d[0]
          ny = y + d[1]
          ni = (ny * @width + nx) * 4
          if nx < 0 or ny < 0 or nx >= @width or ny >= @height then continue
          N.push
            i: ni
            x: nx
            y: ny
            r: data[ni]
            g: data[ni + 1]
            b: data[ni + 2]
            a: data[ni + 3]
        callback?(pixel, N)

  ImageData::each_n4 = (callback) ->
    data = @data
    for y in [0..@height]
      for x in [0..@width]
        i = (y * @width + x) * 4
        pixel =
          i: i
          x: x
          y: y
          r: data[i]
          g: data[i + 1]
          b: data[i + 2]
          a: data[i + 3]

        N = []
        for d in @n4
          nx = x + d[0]
          ny = y + d[1]
          ni = (ny * @width + nx) * 4
          if nx < 0 or ny < 0 or nx >= @width or ny >= @height then continue
          N.push
            i: ni
            x: nx
            y: ny
            r: data[ni]
            g: data[ni + 1]
            b: data[ni + 2]
            a: data[ni + 3]
        callback?(pixel, N)
