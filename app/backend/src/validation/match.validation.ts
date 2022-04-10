const validateEqualsTeams = (homeTeam: number, awayTeam: number) => {
  if (homeTeam === awayTeam) return false;

  return true;
};

export default { validateEqualsTeams };
