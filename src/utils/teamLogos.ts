export const TEAM_LOGOS = {
  'Red Bull Racing': 'https://images.pexels.com/photos/163407/bulls-bull-red-bull-163407.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  'McLaren': 'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  'Ferrari': 'https://images.pexels.com/photos/248687/pexels-photo-248687.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  'Mercedes': 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  'Alpine': 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  'Aston Martin': 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  'Williams': 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  'AlphaTauri': 'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  'Alfa Romeo': 'https://images.pexels.com/photos/248687/pexels-photo-248687.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
  'Haas': 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
};

export function getTeamLogo(teamName: string): string {
  return TEAM_LOGOS[teamName as keyof typeof TEAM_LOGOS] || 'https://images.pexels.com/photos/163407/bulls-bull-red-bull-163407.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop';
}