# Evaluation artifacts

`public/data/policy-value.csv` contains all 36 primary estimates: two evaluation protocols × six checkpoints × three selection methods. Distances and gains are in millimetres. Gain is baseline minus intervention error, averaged over steps 91–100 of a 100-step episode. Positive gain means reduced error.

- Fixed advice (`FS2` in the source CSV): 512 matched states, common five-command baseline and intervention across subsequent policies.
- Repeated selection (`CF3`): 1,024 cases, repeated selection at visited states; baseline is each policy acting alone.
- Checkpoints: 100, 300, 375, 425, 1,000 and 10,000 updates from one BC training run. Updates do not define a universal competence ranking.
- CSV intervals are descriptive paired 95% intervals, not family-adjusted intervals.
- `public/data/results.json` records the primary comparison, supporting diagnostics and replay summaries. Formal primary tests cover 15 directional contrasts at family alpha .010.

## Reproduce the plots

```bash
python -m pip install matplotlib numpy
python scripts/research/reproduce_figures.py
```

This redraws the archived aggregate data; it does not rerun simulation, fit models, or regenerate inferential statistics. The full training/evaluation pipeline, raw trajectories and model checkpoints are outside this artifact repository.

## Media provenance

The task thumbnail crops an actual simulator frame. The two videos are audited simulator replays of exploratory examples, not world-model-generated images or hardware recordings. The source records verified state and distance equality across 720 replayed transitions. Playback is four times slower than simulated physical time, with pauses at each end.

Both positive- and negative-change examples are retained, selected after evaluation near each sign group's median gain change. There are 252 positive, 177 negative and 83 zero changes across the 512-case exploratory population. Example 01 has a worse baseline under BC300 and therefore does not illustrate the primary better-baseline finding.

Public artifact hashes are in `public/data/provenance.json`. The paper and poster provide complete scientific context.
