# Sunset Stall

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/firtualz/warung-senja/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/firtualz/warung-senja/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![license MIT](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![vanilla JS](https://img.shields.io/badge/vanilla-JS%20%2B%20Canvas%202D-blue)](./game)

**Serve the right bowl before patience runs out.**

A night ramen stall in Surabaya. Customers queue up with orders and patience
bars that run down. Cook ramen, gyoza, and iced tea with the right timing —
take them in the green zone for a perfect dish and a bigger tip. Earn
**Rp750.000 in 5 nights** or the stall closes.

## How to play

| Control | Does |
| --- | --- |
| Click / 1–4 | Cook a dish (BROTH RAMEN, SPICY RAMEN, GYOZA, ICED TEA) |
| Click a pot | Take the dish (green = perfect, red = burnt) |
| Click a customer | Select the customer |
| Space | Serve a dish from the tray to the selected customer |
| P | Pause · R: restart · M: sound |

Between nights, buy ingredients and stall upgrades at the shop: Fast Stove, Extra
Seat, Big Pot. Three angry customers in one night = lose.
Bankrupt (no ingredients and not enough coins) = lose.

## Run it

```sh
node serve.ts   # http://localhost:8080
```

A pure static game: vanilla JS + Canvas 2D, no libraries, no network.
Deterministic screenshots: `?shot=cover|title|play|nightend`.

An entry for [make.fun best-game-01](https://make.fun/bounty/best-game-01).
