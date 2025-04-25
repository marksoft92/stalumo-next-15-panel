export const mailContent = (email, subject, reply,content) => {
    return `
<!-- Free to use, HTML email template designed & built by FullSphere. Learn more about us at www.fullsphere.co.uk -->

<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <!-- Your title goes here -->
    <title>www.stalumo.com</title>
    <!-- End title -->
    <!-- Start stylesheet -->
    <style type="text/css">
      a,a[href],a:hover, a:link, a:visited {
        /* This is the link colour */
        text-decoration: none!important;
        color: #0000EE;
      }
      .link {
        text-decoration: underline!important;
      }
      p, p:visited {
        /* Fallback paragraph style */
        font-size:15px;
        line-height:24px;
        font-family:'Helvetica', Arial, sans-serif;
        font-weight:300;
        text-decoration:none;
        color: #000000;
      }
      h1 {
        /* Fallback heading style */
        font-size:22px;
        line-height:24px;
        font-family:'Helvetica', Arial, sans-serif;
        font-weight:normal;
        text-decoration:none;
        color: #000000;
      }
      .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
      .ExternalClass {width: 100%;}
    </style>
    <!-- End stylesheet -->
</head>
  <!-- You can change background colour here -->
  <body style="text-align: center; margin: 0; padding-top: 10px; padding-bottom: 10px; padding-left: 0; padding-right: 0; -webkit-text-size-adjust: 100%;background-color: #f2f4f6; color: #000000" align="center">
  <!-- Fallback force center content -->
  <div style="text-align: center;">
    <!-- Email not displaying correctly -->
<!--    <table align="center" style="text-align: center; vertical-align: middle; width: 600px; max-width: 600px;" width="600">-->
<!--      <tbody>-->
<!--        <tr>-->
<!--          <td style="width: 596px; vertical-align: middle;" width="596">-->

<!--            <p style="font-size: 11px; line-height: 20px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #000000;">Is this email not displaying correctly? <a class="link" style="text-decoration: underline;" target="_blank" href="https://stalumo.com"><u>Click here</u></a> to view in browser</p>-->

<!--          </td>-->
<!--        </tr>-->
<!--      </tbody>-->
<!--    </table>-->
    <!-- Email not displaying correctly -->
    <!-- Start container for logo -->
    <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #000;" width="600">
      <tbody>
        <tr>
          <td style="width: 596px; vertical-align: top; padding-left: 0; padding-right: 0; padding-top: 15px; padding-bottom: 15px;" width="596">
            <!-- Your logo is here -->
            <img style="width: 180px; max-width: 180px; height: 85px; max-height: 200px; text-align: center; color: #ffffff;" alt="Logo" src="http://www.stalumo.pl/_next/image?url=%2Fassets%2Fimages%2Fstalumo.png&w=384&q=75" align="center" width="180" height="85">
          </td>
        </tr>
      </tbody>
    </table>
    <!-- End container for logo -->
    <!-- Hero image -->
    <img style="width: 600px; max-width: 600px; height: 350px; max-height: 350px; text-align: center;" alt="Hero image" src="http://panel.stalumo.pl/image-public-uploads/14951da6-0682-4b72-a7b5-ea4c77367b6f-img_work3.jpg" align="center" width="600" height="350">
    <!-- Hero image -->
    <!-- Start single column section -->
    <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #ffffff;" width="600">
        <tbody>
          <tr>
            <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;" width="596">
              <h3 style="font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 600; text-decoration: none; color: #000000;">${email}</h3>
              <p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #919293;">${subject}</p> 
              <br/><br/>    
               <p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #919293;">${content}</p>           
              </td>
          </tr>
        </tbody>
      </table>
      <!-- End single column section -->
      <!-- Start image -->
      <img style="width: 600px; max-width: 600px; height: 240px; max-height: 240px; text-align: center;" alt="Image" src="http://panel.stalumo.pl/image-public-uploads/25d38f9d-1b20-4337-bef9-8e5edd678fb1-img_work1.jpg" align="center" width="600" height="240">
      <!-- End image -->
    <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #ffffff;" width="600">
        <tbody>
          <tr>
            <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 40px;" width="596">
              <h1 style="font-size: 20px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 600; text-decoration: none; color: #000000;">Stalumo - biuro@stalumo.com</h1>
              <p style="font-size: 15px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #919293;">${reply}</p>              
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Start image -->
      <img style="width: 600px; max-width: 600px; height: 240px; max-height: 240px; text-align: center;" alt="Image" src="http://panel.stalumo.pl/image-public-uploads/04480c12-9847-46f6-bb61-bad06e77741b-img_work2.jpg" align="center" width="600" height="240">
      <!-- End image -->
      <!-- Start footer -->
      <table align="center" style="text-align: center; vertical-align: top; width: 600px; max-width: 600px; background-color: #000000;" width="600">
        <tbody>
          <tr>
            <td style="width: 596px; vertical-align: top; padding-left: 30px; padding-right: 30px; padding-top: 30px; padding-bottom: 30px;" width="596">
              <!-- Your inverted logo is here -->
              <img style="width: 180px; max-width: 180px; height: 200px; max-height: 100px; text-align: center; color: #ffffff;" alt="Logo" src="http://www.stalumo.pl/_next/image?url=%2Fassets%2Fimages%2Fstalumo.png&w=384&q=75
" align="center" width="180" height="85">     
                 <p style="font-size: 13px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #ffffff; text-decoration: underline; color: #ffffff;">
          Location: Drawno, Poland<br>
          Email: <a style="text-decoration: underline; color: #ffffff;" href="mailto:biuro@stalumo.com">biuro@stalumo.com</a><br>
          Phone: +48 784-532-549, +48 881-961-657     
              </p>
              <p style="margin-bottom: 0; font-size: 13px; line-height: 24px; font-family: 'Helvetica', Arial, sans-serif; font-weight: 400; text-decoration: none; color: #ffffff;">
                <a target="_blank" style="text-decoration: underline; color: #ffffff;" href="https://stalumo.com">
                  www.stalumo.com
                </a>
                        <div>
          <a style="text-decoration: underline; color: #ffffff;" href="https://www.facebook.com/profile.php?id=61563758556441" target="_blank">Facebook</a> |
          <a style="text-decoration: underline; color: #ffffff;" href="https://www.tiktok.com/@stalumo.com?is_from_webapp=1&sender_device=pc" target="_blank">TikTok</a> |
          <a style="text-decoration: underline; color: #ffffff;" href="https://www.instagram.com/stalumo/" target="_blank">Instagram</a>
        </div>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
  </body>
</html>
`;
}
