"use client";

import { PhotoBanner } from "../../components/CraftPhoto";
import { CROCHET_HOOKS, HOOK_SOURCE } from "../../lib/hooks";
import { stitches } from "../../lib/stitches";

export default function ReferencePage() {
  return (
    <div>
      <PhotoBanner shot="squares" />
      <p className="eyebrow no-print">Printable reference</p>
      <h1>Sheets you can take to the chair.</h1>
      <p className="lede no-print">Abbreviations, hook sizes, and the stitch list. These are filled reference sheets, not blank worksheets.</p>
      <p className="no-print"><button className="primary" type="button" onClick={() => window.print()}>Print these sheets</button></p>

      <section className="panel">
        <h2>US and UK abbreviations</h2>
        <p>US single crochet is UK double crochet. The names below are the dictionary entries, not a second list.</p>
        <div className="table-wrap">
          <table>
            <caption>Stitch abbreviations</caption>
            <thead><tr><th>Stitch</th><th>US</th><th>UK</th></tr></thead>
            <tbody>
              {stitches.map((stitch) => (
                <tr className="stitch-print" key={stitch.slug}>
                  <td>{stitch.name}</td>
                  <td>{stitch.us}</td>
                  <td>{stitch.uk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Hook conversion</h2>
        <p>{HOOK_SOURCE}</p>
        <div className="table-wrap">
          <table>
            <caption>Regular crochet hooks</caption>
            <thead><tr><th>Millimeters</th><th>US size</th></tr></thead>
            <tbody>
              {CROCHET_HOOKS.map((hook) => (
                <tr key={hook.mm}><td>{hook.mm}</td><td>{hook.us || "No US size listed"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Stitch list</h2>
        <div className="table-wrap">
          <table>
            <caption>All {stitches.length} stitches</caption>
            <thead><tr><th>Stitch</th><th>Level</th><th>Category</th><th>Multiple</th><th>Height</th></tr></thead>
            <tbody>
              {stitches.map((stitch) => (
                <tr className="stitch-print" key={stitch.slug}>
                  <td>{stitch.name}</td>
                  <td>{stitch.level}</td>
                  <td>{stitch.cat}</td>
                  <td>{stitch.mult}</td>
                  <td>{stitch.h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
