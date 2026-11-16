import type { Metadata } from "next";
import Link from "next/link";
import { PhotoBanner } from "../../components/CraftPhoto";
import { sizeCharts, sizeChartGroups } from "../../lib/stitches";

export const metadata: Metadata = {
  title: "Size charts",
  description: "Body measurement charts and ease notes for planning crochet garments.",
};

export default function SizesPage() {
  return (
    <div>
      <PhotoBanner shot="swatches" priority />
      <p className="eyebrow">Reference</p>
      <h1>Body measurements and ease</h1>
      <p className="lede">{sizeCharts.source}. Measurements are inches. Use them with the garment calculator and your own gauge swatch.</p>
      <p className="no-print"><Link href="/calculators#garment">Turn a measurement into stitches</Link></p>
      {sizeChartGroups.map((group) => {
        const chart = sizeCharts.charts[group];
        return (
          <section key={group} style={{ marginTop: "1.4rem" }}>
            <h2>{group}</h2>
            <div className="table-wrap">
              <table>
                <caption>{group}, inches</caption>
                <thead>
                  <tr>
                    <th>Measurement</th>
                    {chart.sizes.map((size) => <th key={size}>{size}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sizeCharts.rows.map((row, rowIndex) => (
                    <tr key={row}>
                      <th scope="row">{row}</th>
                      {chart.values[rowIndex]?.map((value, valueIndex) => <td key={`${row}-${chart.sizes[valueIndex]}`}>{value}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
      <h2>Ease</h2>
      <ul>
        {sizeCharts.ease.map((item) => <li key={item[0]}><strong>{item[0]}.</strong> {item[1]}</li>)}
      </ul>
    </div>
  );
}
