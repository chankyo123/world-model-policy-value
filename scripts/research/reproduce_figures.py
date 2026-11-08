#!/usr/bin/env python3
"""Replot frozen aggregate estimates. No experiments or inference are rerun."""
from pathlib import Path
import csv
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
root=Path(__file__).resolve().parents[2]
rows=list(csv.DictReader((root/'public/data/policy-value.csv').open()))
checkpoints=[100,300,375,425,1000,10000]
assert len(rows)==36
plt.rcParams.update({'font.family':'DejaVu Serif','font.size':12,'axes.spines.top':False,'axes.spines.right':False,'axes.labelcolor':'#142d3a','text.color':'#142d3a','xtick.color':'#65716f','ytick.color':'#65716f','figure.facecolor':'#f8f7f2','axes.facecolor':'#f8f7f2'})
fig,axes=plt.subplots(1,2,figsize=(13,4.6),constrained_layout=True)
for ax,study,title in zip(axes,['FS2','CF3'],['Fixed advice · 512 shared states','Repeated selection · 1,024 cases']):
 for arm,label,color,marker in [('WM','World-model features','#176985','o'),('Direct','Current features','#b86a38','s'),('Random','Random choice','#697a74','^')]:
  r=[x for x in rows if x['study']==study and x['arm']==arm]
  assert len(r)==6 and [int(x['update']) for x in r]==checkpoints
  m=np.array([float(x['mean_mm']) for x in r]);lo=np.array([float(x['ci95_lo']) for x in r]);hi=np.array([float(x['ci95_hi']) for x in r])
  ax.errorbar(np.arange(6),m,yerr=np.vstack([m-lo,hi-m]),label=label,color=color,marker=marker,capsize=3,lw=1.6,ms=5)
 ax.axhline(0,color='#a7b1ae',lw=.8);ax.set_xticks(np.arange(6),['100','300','375','425','1,000','10,000']);ax.set_xlabel('BC checkpoint (training updates)');ax.set_ylabel('Intervention gain (mm)');ax.set_title(title,pad=16,fontsize=14);ax.grid(axis='y',alpha=.2);ax.set_ylim(-14,32)
axes[0].legend(frameon=False,loc='upper left',fontsize=9)
out=root/'public/media';out.mkdir(exist_ok=True)
fig.savefig(out/'results-overview.png',dpi=160);fig.savefig(out/'results-overview.pdf');plt.close(fig)
print('Reproduced all 36 descriptive paired estimates.')
