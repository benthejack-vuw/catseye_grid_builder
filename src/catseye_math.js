function lerp(pt1,pt2,amt){
	
	return {
		x: pt1.x + ((pt2.x-pt1.x)*amt),
		y: pt1.y + ((pt2.y-pt1.y)*amt)
	}

}