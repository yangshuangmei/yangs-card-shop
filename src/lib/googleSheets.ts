export async function getProductsFromSheet(sheetUrl: string) {
  try {
    const response = await fetch(sheetUrl, { next: { revalidate: 60 } }); // 每60秒缓存刷新一次
    const text = await response.text();
    
    // 解析 CSV (简单逻辑，处理第一行后的内容)
    const rows = text.split('\n').slice(1); 
    return rows.map(row => {
      const [id, name, series, price, image, type, category, rarity, stock, description] = row.split(',');
      return {
        id: id?.trim(),
        name: name?.trim(),
        series: series?.trim(),
        price: parseFloat(price?.trim() || '0'),
        image: image?.trim(),
        type: type?.trim(),
        category: category?.trim(),
        rarity: rarity?.trim(),
        stock: parseInt(stock?.trim() || '0'),
        description: description?.trim()
      };
    }).filter(p => p.id); // 过滤掉空行
  } catch (error) {
    console.error("Failed to fetch Google Sheets data:", error);
    return [];
  }
}
