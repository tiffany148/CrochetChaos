---
type: chapter
part: 12
chapter: 66
title: "Crochet Formulas: Gauge, Multiples, Increases and Circles"
source: "new for this edition"
status: "new"
---

This chapter gathers the arithmetic crocheters use most, each with the formula, a worked example and a note on where the formula stops being reliable. The tables in Chapters 67 and 44 apply these formulas to common numbers; Chapter 69 covers yarn quantities.

> [!STATUS]
> Formulas are standard arithmetic. Worked examples use round illustrative numbers computed by the script that writes this chapter (`src/formulas.py`); they are not measurements of a sample. Every crochet formula depends on your measured gauge.

## Gauge: stitches and rows per inch

Gauge is the number of stitches and rows in a measured distance, usually 4 in (10 cm). Divide to get the per-inch rate.

| Quantity | Formula |
|---|---|
| Stitches per inch | stitches in swatch ÷ inches measured |
| Rows per inch | rows in swatch ÷ inches measured |
| Stitches for a width | width (in) × stitches per inch |
| Rows for a length | length (in) × rows per inch |
| Width of a stitch count | stitches ÷ stitches per inch |

> [!HINT] Worked example
> 16 sts in 4 in gives 4 sts per inch. A 20 in wide panel needs 20 × 4 = 80 sts.

> [!DANG] Dang, I Wish I'd Known That! — Measure the middle of the swatch
> Edge stitches are distorted. Measure across the center 4 in of a swatch at least 6 in wide, after blocking it the way the project will be blocked.

## Stitch multiples: fitting a pattern repeat

A stitch pattern written as "multiple of m + r" needs a chain of k × m + r, where k is the number of repeats. To get close to a target number of chains:

k = round((target − r) ÷ m), then chain = k × m + r

> [!HINT] Worked example
> A shell pattern is a multiple of 6 + 2 and you want about 100 ch. k = round((100 − 2) ÷ 6) = 16; chain 16 × 6 + 2 = 98.

## Increasing or decreasing evenly across a row

To add (or remove) a number of stitches spread evenly across a row of existing stitches:

1. Divide the stitch count by the number of increases: have ÷ add = q, remainder r.
2. Work an increase in every q-th stitch; spread the r leftover stitches between the repeats (or work them at the end).

> [!HINT] Worked example
> Add 8 sts evenly across 60 sts: 60 ÷ 8 = 7 remainder 4. Work (sc in next 6 sts, 2 sc in next st) 8 times, then sc in the last 4 sts. Total 60 + 8 = 68.

For decreases, use the same division and replace each increase with a decrease over two stitches.

## Flat circles

A flat circle needs the same number of stitches added in every round. Common starting points, used by many designers, are:

| Stitch | Round 1 | Added each round |
|---|---|---|
| sc | 6 | 6 |
| hdc | 8 | 8 |
| dc | 12 | 12 |

These are guidelines; your tension may need one or two more or fewer. If the circle cups, add stitches; if it ruffles, add fewer. Spread increases so they do not stack, unless you want a hexagon or other polygon.

## Diameter from circumference

For hats, baskets and round pieces:

diameter = circumference ÷ π (π ≈ 3.14)

> [!HINT] Worked example
> A 21 in hat circumference needs a flat crown about 21 ÷ 3.14 = 6.7 in across before the sides begin. Chapter 44 uses this with ease and gauge.

## Rectangles, squares and blankets

| Goal | Formula |
|---|---|
| Foundation chain for a width (sc) | width × sts per inch + 1 turning ch |
| Foundation chain for a width (dc) | width × sts per inch + 2 (ch 3 counts as the first dc) |
| Squares needed for a blanket | (blanket width ÷ square width) × (blanket length ÷ square length) |
| Finished motif size | measured motif + join allowance |

## Granny square growth

A traditional granny square worked in 3-dc groups grows by one group per side each round. A corner is two 3-dc groups separated by a chain space, one belonging to each side. Each side of Round n therefore has n groups: the corner group at each end plus n − 2 groups between them (from Round 2 on). The square has 4n groups in total.

| Round | 3-dc groups per side | Side groups between corners | Total groups |
|---|---|---|---|
| 1 | 1 | – | 4 |
| 2 | 2 | 0 | 8 |
| 3 | 3 | 1 | 12 |
| 4 | 4 | 2 | 16 |
| 5 | 5 | 3 | 20 |
| 6 | 6 | 4 | 24 |
| 7 | 7 | 5 | 28 |
| 8 | 8 | 6 | 32 |

> [!HINT] Check
> Round 1 has 4 groups (all corners). Each later round adds 4 groups: one more along each side. Total = 4n.

## Corner-to-corner (C2C) tiles

A rectangle of W × H tiles is worked in W + H − 1 diagonal rows, increasing to the first corner and then decreasing. The total number of tiles is W × H.

## Percentages and ease

| Quantity | Formula |
|---|---|
| Finished measurement with positive ease | body measurement + ease |
| Negative ease (stretchy items) | body measurement − ease |
| Percentage of a measurement | measurement × percent ÷ 100 |

> [!DANG] Dang, I Wish I'd Known That! — Ease is a design choice
> Ease depends on the garment, the stitch and the wearer's preference. Use the Craft Yarn Council's fit ranges in Chapter 38 as a starting point and compare with a garment you already like.

## Unit conversions

| From | To | Multiply by |
|---|---|---|
| inches | centimeters | 2.54 |
| centimeters | inches | 0.3937 |
| yards | meters | 0.9144 |
| meters | yards | 1.0936 |
| ounces | grams | 28.35 |
| grams | ounces | 0.0353 |

![Decorative generated crochet art](../../assets/art/fill/p12-yarn-scale.jpg)
