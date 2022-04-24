export abstract class MathUtils{
  static distance(a: any, b: any){
    let xs = b.x - a.x;
		let ys = b.y - a.y;		
	
    xs *= xs;
    ys *= ys;
	 
	  return Math.sqrt( xs + ys );
  }

  static angleBetween(a: any, b: any){
    return Math.atan2(a.y - b.y, a.x - b.x) - (90 * Math.PI / 180);
  }
}