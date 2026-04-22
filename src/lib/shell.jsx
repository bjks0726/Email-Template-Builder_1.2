// Build the final email HTML document from a list of block instances.

export function buildShell({ blocks, settings, tokens: t, registry }) {
  const inner = blocks
    .map((blk) => registry[blk.snippet]?.toHTML(blk.data, t) || "")
    .join("\n");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<title>${settings.title}</title>
<style type="text/css">
.f-primary{font-family:${t.fontStack};}
*{-webkit-text-size-adjust:none;}
@media (max-width:590px){
  .fullWidth{width:100% !important;max-width:100% !important;height:auto !important;}
  .m300width{width:300px !important;max-width:300px !important;height:auto !important;}
  .mobile_padding-full-0{padding:0 !important;}
  .mobile_padding-lr-24{padding:0 24px !important;}
  .mobile_padding-b-24{padding-bottom:24px !important;}
  .mobStacking{display:table !important;width:100% !important;height:auto !important;}
  .mobilehidded{display:none !important;}
  .invertcomp{direction:ltr !important;}
  .hlalign_center{text-align:center !important;}
}
</style></head>
<body style="width:100%;margin:0 auto !important;padding:0 !important;background-color:${t.footerBg};">
<div style="display:none;max-height:0;max-width:0;opacity:0;overflow:hidden;">${settings.preheader}&#8199;&#65279;&#847;</div>
<table role="presentation" class="fullWidth" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${t.outerBg}" style="background-color:${t.outerBg};margin-top:10px;">
<tr><td align="center" style="font-family:tahoma,Arial,sans-serif;font-size:11px;line-height:16px;color:${t.bodyColor};padding:16px;">To view this email as a web page, <a href="[@Hosted Type='HTML'/]" style="color:${t.linkColor};text-decoration:underline;font-weight:bold;">click here</a></td></tr>
<tr><td align="center">
<table role="presentation" border="0" cellspacing="0" cellpadding="0" class="fullWidth" width="696" align="center" bgcolor="${t.canvasBg}" style="background-color:${t.canvasBg};max-width:696px;border:solid 2px #010101;">
${inner}
</table></td></tr></table>
</body></html>`;
}
