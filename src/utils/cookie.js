const updateStep = (cookies, step) => {
  if (Number(cookies.get('tourStep')) === (step - 1)) {
    cookies.set('tourStep', step, { path: '/' });
  }
}

export default updateStep;
