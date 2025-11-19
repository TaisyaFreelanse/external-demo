# DejaVu Fonts Setup for jsPDF

This project uses self-hosted DejaVu Sans fonts for Cyrillic character support in PDF generation with jsPDF 3.x.

## Font Files Required

Place the following TTF font files in the `public/fonts/` directory:

- `DejaVuSans.ttf` - Regular font
- `DejaVuSans-Oblique.ttf` - Italic font variant

## Download Instructions

### Option 1: Download from GitHub Releases (Recommended)

1. Visit: https://github.com/dejavu-fonts/dejavu-fonts/releases
2. Download the latest release (e.g., `dejavu-fonts-ttf-2.37.zip`)
3. Extract the zip file
4. Navigate to `ttf/` folder in the extracted archive
5. Copy `DejaVuSans.ttf` and `DejaVuSans-Oblique.ttf` to `public/fonts/` in this project

### Option 2: Download from SourceForge

1. Visit: https://sourceforge.net/projects/dejavu/files/dejavu/
2. Download the latest TTF package
3. Extract and copy the required font files to `public/fonts/`

### Option 3: Use PowerShell Script

Run the provided PowerShell script (may require manual retry if network issues occur):

```powershell
powershell -ExecutionPolicy Bypass -File download-fonts.ps1
```

## Verification

After downloading, verify the files exist:

- `public/fonts/DejaVuSans.ttf` (should be ~700KB+)
- `public/fonts/DejaVuSans-Oblique.ttf` (should be ~600KB+)

The fonts will be automatically loaded at runtime when generating PDFs with Cyrillic characters.

## Code Implementation

The fonts are loaded using jsPDF 3.x compatible methods:

```typescript
// Fonts are loaded from /fonts/DejaVuSans.ttf at runtime
// Using addFileToVFS() and addFont() methods
doc.addFileToVFS('DejaVuSans.ttf', base64FontData)
doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal')
doc.setFont('DejaVuSans', 'normal')
```

See `utils/generatePdfReport.ts` for implementation details.

