export const authMsg = (subject, url) => {
  return `
        <div style="border: 5px solid #ccc; padding: 15px;">
          <h1 style="text-align: center;">Let's work | Kyiv ${subject}</h1>
          <p>Please click below button to proceed the chosen action</p>
          <a style="display: block; text-decoration: none; background: orange; color: #fff; width: 130px; height: 35px; text-align: center; line-height: 35px; margin-top: 15px" href=${url}>Click Me</a>
          <div style="margin-top: 20px;">
            <p>Thank you for using <strong>Let's work | Kyiv</strong> as your job portal app.
            <p>Warm Regards,</p>
            <p>- Let's work | Kyiv Team -</p>
          </div>
        </div>
      `;
};
