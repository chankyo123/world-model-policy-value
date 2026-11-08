#!/usr/bin/env python3
"""Package only the website and public scientific artifacts for GitHub/import."""
from pathlib import Path
import zipfile,json,hashlib
root=Path(__file__).resolve().parents[2]
allowed_dirs={'app','components','hooks','lib','public','scripts','worker','research','vendor'}
allowed_files={'README.md','CITATION.cff','package.json','package-lock.json','tsconfig.json','vite.config.ts','next.config.ts','next.config.mjs','postcss.config.mjs','eslint.config.mjs','.gitignore','NOTICE.txt','cloudflare-env.d.ts','drizzle.config.ts','components.json','.npmrc'}
archive=root/'public/downloads/project-source.zip'
paths=[]
for p in root.rglob('*'):
 if not p.is_file(): continue
 rel=p.relative_to(root)
 if rel.parts[0] not in allowed_dirs and str(rel) not in allowed_files: continue
 if any(x in rel.parts for x in ['node_modules','.git','__pycache__','.sites-runtime','.wrangler']): continue
 if p==archive or p.suffix in {'.pyc','.log'} or p.name.startswith('.env'): continue
 paths.append((p,rel))
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p,rel in sorted(paths): z.write(p,rel)
 # The public copy has no ownership identity. Local development works without it.
 z.writestr('.openai/hosting.json',json.dumps({'project_id':None,'d1':None,'r2':None},indent=2)+'\n')
manifest={'file_count':len(paths)+1,'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'scope':'Website source, public frozen evaluation artifacts, figures and audited simulator replays. No raw training pipeline or checkpoints.','files':[str(r) for _,r in sorted(paths)]+['.openai/hosting.json']}
(root/'outputs').mkdir(exist_ok=True)
(root/'outputs/public-package.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Packaged {len(paths)+1} public files, {archive.stat().st_size:,} bytes.')
