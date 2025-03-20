class DataCachedController {
  ImageCached: { [key: string]: HTMLImageElement } = {};
  HttpAnsRequest: { Symbol: any};
  SymbolMap: Map<string, Symbol> = new Map();
  SymbolJsonCached: Map<Symbol, string> = new Map();
  getImage(url: string, force?: boolean): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
      if (this.ImageCached[url] && !force) return res(this.ImageCached[url]);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.ImageCached[url] = Object.freeze(img);
        res(img);
      };
      img.onerror = err => {
        rej(err);
      };
    });
  }
  registerSymbol(request: string) {
    this.SymbolMap.set(request, Symbol(request));
  }
  getSymbol(request: string) { 
    return this.SymbolMap.get(request);
  }
  getCachedBySymbol(symbol: Symbol) {
    return JSON.parse(this.SymbolJsonCached.get(symbol));
  }
  setCachedBySymbol(symbol: Symbol, data: any, force?: boolean) {
    this.SymbolJsonCached.set(symbol, JSON.stringify(data));
  }
}
