//============================================================================
// PROJECT ID: CLUSTER1-27
//
// GROUP NUMBER:11
//
// STUDENT NAME: Jiang Xiaochong
// NUS User ID.: t0918078
//
// STUDENT NAME: Zeng Mingjie
// NUS User ID.: t0918460
//
// STUDENT NAME: Zhang Chuqi
// NUS User ID.: t0918199
//
// COMMENTS TO GRADER: 
//
//============================================================================


// FRAGMENT SHADER FOR SHADERTOY
// Run this at https://www.shadertoy.com/new
// See documentation at https://www.shadertoy.com/howto

// Your browser must support WebGL 2.0.
// Check your browser at http://webglreport.com/?v=2

//============================================================================
// Constants.
//============================================================================
const int NUM_LIGHTS = 2;
const int NUM_MATERIALS = 6;
const int NUM_PLANES = 1;
const int NUM_SPHERES = 1;
const int NUM_AABOXES = 29;
const int NUM_CONES = 6;

 // Vertical field-of-view angle of camera. In radians.
const float FOVY = 55.0 * 3.1415926535 / 180.0; 

// Use this for avoiding the "epsilon problem" or the shadow acne problem.
const float DEFAULT_TMIN = 10.0e-4;

// Use this for tmax for non-shadow ray intersection test.
const float DEFAULT_TMAX = 10.0e6;

// Equivalent to number of recursion levels (0 means ray-casting only).
// We are using iterations to replace recursions.
const int NUM_ITERATIONS = 6;

const float INTERVAL = 0.5;

//direction
int MOV_DIRECTION = 0; // 1:up, 2:down, 3:left, 4:right
//set drop delta time
float PREV_TIME = 0.0;
float CURR_TIME = 0.0;

//============================================================================
// Define new struct types.
//============================================================================
struct Ray_t {
    vec3 o;  // Ray Origin.
    vec3 d;  // Ray Direction. A unit vector.
};

struct Plane_t {
    // The plane equation is Ax + By + Cz + D = 0.
    float A, B, C, D;
    // plane type
    int type;      //default type = 0 ; texture type = 1
    //only usful when type = 0
    int materialID;
    //only use when type = 1
    float s, t;    
    int textureID; //binds to channel
};

struct Sphere_t {
    vec3 center;
    float radius;
    int materialID;
    int BoxID;            //only for Sphere[0], to show current on which AABox
};

struct AABox_t {
    vec3 center;
    vec3 size;
    int materialID;
};

struct Cone_t {
    float cosa;
    float height;
    vec3 apex;
    vec3 axis;
    int materialID;
};

struct Light_t {
    vec3 position;  // Point light 3D position.
    vec3 I_a;       // For Ambient.
    vec3 I_source;  // For Diffuse and Specular.
};

struct Material_t {
    vec3 k_a;   // Ambient coefficient.
    vec3 k_d;   // Diffuse coefficient.
    vec3 k_r;   // Reflected specular coefficient.
    vec3 k_rg;  // Global reflection coefficient.
    float n;    // The specular reflection exponent. Ranges from 0.0 to 128.0. 
};

//----------------------------------------------------------------------------
// The lighting model used here is similar to that on Slides 8 and 12 of 
// Lecture 11 (Ray Tracing). Here it is computed as
//
//     I_local = SUM_OVER_ALL_LIGHTS { 
//                   I_a * k_a + 
//                   k_shadow * I_source * [ k_d * (N.L) + k_r * (R.V)^n ]
//               }
// and
//     I = I_local  +  k_rg * I_reflected
//----------------------------------------------------------------------------


//============================================================================
// Global scene data.
//============================================================================
Plane_t Plane[NUM_PLANES];
Sphere_t Sphere[NUM_SPHERES];
AABox_t AABox[NUM_AABOXES];
Cone_t Cone[NUM_CONES];
Light_t Light[NUM_LIGHTS];
Material_t Material[NUM_MATERIALS];

/////////////////////////////////////////////////////////////////////////////
// Initializes the map.
/////////////////////////////////////////////////////////////////////////////
void InitMap()
{
    // AABox.
    // AABox[0].center = vec3(0.0, 3.0, 5.0);
    // AABox[0].size = vec3(1.0, 0.2, 10.0);
    // AABox[0].materialID = 0;

    // AABox[1].center = vec3(5.5, 3.0, 9.5);
    // AABox[1].size = vec3(10.0, 0.2, 1.0);
    // AABox[1].materialID = 0;

    // AABox[2].center = vec3(10.0, 3.0, 15.0);
    // AABox[2].size = vec3(1.0, 0.2, 10.0);
    // AABox[2].materialID = 0;

    // AABox[3].center = vec3(4.5, 3.0, 19.5);
    // AABox[3].size = vec3(10.0, 0.2, 1.0);
    // AABox[3].materialID = 0;

    // AABox[4].center = vec3(0.0, 3.0, 25.0);
    // AABox[4].size = vec3(1.0, 0.2, 10.0);
    // AABox[4].materialID = 0;

    // AABox[5].center = vec3(5.5, 3.0, 29.5);
    // AABox[5].size = vec3(10.0, 0.2, 1.0);
    // AABox[5].materialID = 0;

    // AABox[6].center = vec3(15.5, 3.0, 29.5);
    // AABox[6].size = vec3(10.0, 0.2, 1.0);
    // AABox[6].materialID = 0;
    AABox[0].center = vec3(13.5, 3.0, 1.5);
    AABox[0].size = vec3(27.0, 0.2, 3.0);
    AABox[0].materialID = 0;

    AABox[1].center = vec3(1.5, 3.0, 9.0);
    AABox[1].size = vec3(3.0, 0.2, 12.0);
    AABox[1].materialID = 0;

    AABox[2].center = vec3(4.5, 3.0, 13.5);
    AABox[2].size = vec3(3.0, 0.2, 3.0);
    AABox[2].materialID = 0;

    AABox[3].center = vec3(7.5, 3.0, 16.5);
    AABox[3].size = vec3(3.0, 0.2, 15.0);
    AABox[3].materialID = 0;

    AABox[4].center = vec3(18.0, 3.0, 7.5);
    AABox[4].size = vec3(24.0, 0.2, 3.0);
    AABox[4].materialID = 0;

    AABox[5].center = vec3(31.5, 3.0, 9.0);
    AABox[5].size = vec3(3.0, 0.2, 12.0);
    AABox[5].materialID = 0;

    AABox[6].center = vec3(33.0, 3.0, 1.5);
    AABox[6].size = vec3(6.0, 0.2, 3.0);
    AABox[6].materialID = 0;

    AABox[7].center = vec3(37.5, 3.0, 19.5);
    AABox[7].size = vec3(3.0, 0.2, 39.0);
    AABox[7].materialID = 0;

    AABox[8].center = vec3(1.5, 3.0, 21.0);
    AABox[8].size = vec3(3.0, 0.2, 6.0);
    AABox[8].materialID = 0;

    AABox[9].center = vec3(18.0, 3.0, 19.5);
    AABox[9].size = vec3(6.0, 0.2, 3.0);
    AABox[9].materialID = 0;

    AABox[10].center = vec3(13.5, 3.0, 18.0);
    AABox[10].size = vec3(3.0, 0.2, 6.0);
    AABox[10].materialID = 0;

    AABox[11].center = vec3(19.5, 3.0, 13.5);
    AABox[11].size = vec3(15.0, 0.2, 3.0);
    AABox[11].materialID = 0;

    AABox[12].center = vec3(25.5, 3.0, 18.0);
    AABox[12].size = vec3(3.0, 0.2, 6.0);
    AABox[12].materialID = 0;

    AABox[13].center = vec3(30.0, 3.0, 19.5);
    AABox[13].size = vec3(6.0, 0.2, 3.0);
    AABox[13].materialID = 0;

    AABox[14].center = vec3(31.5, 3.0, 22.5);
    AABox[14].size = vec3(3.0, 0.2, 3.0);
    AABox[14].materialID = 0;

    AABox[15].center = vec3(7.5, 3.0, 25.5);
    AABox[15].size = vec3(15.0, 0.2, 3.0);
    AABox[15].materialID = 0;

	AABox[16].center = vec3(1.5, 3.0, 34.5);
    AABox[16].size = vec3(3.0, 0.2, 9.0);
    AABox[16].materialID = 0;

	AABox[17].center = vec3(4.5, 3.0, 31.5);
    AABox[17].size = vec3(3.0, 0.2, 3.0);
    AABox[17].materialID = 0;

	AABox[18].center = vec3(7.5, 3.0, 34.5);
    AABox[18].size = vec3(3.0, 0.2, 9.0);
    AABox[18].materialID = 0;

	AABox[19].center = vec3(10.5, 3.0, 37.5);
    AABox[19].size = vec3(3.0, 0.2, 3.0);
    AABox[19].materialID = 0;

	AABox[20].center = vec3(13.5, 3.0, 34.5);
    AABox[20].size = vec3(3.0, 0.2, 9.0);
    AABox[20].materialID = 0;

	AABox[21].center = vec3(16.5, 3.0, 31.5);
    AABox[21].size = vec3(3.0, 0.2, 3.0);
    AABox[21].materialID = 0;

	AABox[22].center = vec3(19.5, 3.0, 27.0);
    AABox[22].size = vec3(3.0, 0.2, 12);
    AABox[22].materialID = 0;

	AABox[23].center = vec3(21, 3.0, 37.5);
    AABox[23].size = vec3(6.0, 0.2, 3.0);
    AABox[23].materialID = 0;

	AABox[24].center = vec3(22.5, 3.0, 25.5);
    AABox[24].size = vec3(3.0, 0.2, 3.0);
    AABox[24].materialID = 0;

	AABox[25].center = vec3(25.5, 3.0, 31.5);
    AABox[25].size = vec3(3.0, 0.2, 15.0);
    AABox[25].materialID = 0;

	AABox[26].center = vec3(31.5, 3.0, 34.5);
    AABox[26].size = vec3(3.0, 0.2, 9.0);
    AABox[26].materialID = 0;

	AABox[27].center = vec3(33.0, 3.0, 25.5);
    AABox[27].size = vec3(6.0, 0.2, 3.0);
    AABox[27].materialID = 0;

    AABox[28].center = vec3(34.5, 3.0, 37.5);
    AABox[28].size = vec3(3.0, 0.2, 3.0);
    AABox[28].materialID = 0;
    // Cone.
    Cone[0].cosa = 0.7;
    Cone[0].height = 0.5;
    Cone[0].apex = vec3(25.5, 6.1, 1.5);
    Cone[0].axis = vec3(0.0, -1.0, 0.0);
    Cone[0].materialID = 2;

    Cone[1].cosa = 0.7;
    Cone[1].height = 0.5;
    Cone[1].apex = vec3(25.5, 5.1, 1.5);
    Cone[1].axis = vec3(0.0, 1.0, 0.0);
    Cone[1].materialID = 2;

    Cone[2].cosa = 0.7;
    Cone[2].height = 0.5;
    Cone[2].apex = vec3(19.5, 6.1 + 0.3 * cos(iTime * 5.0), 37.5);
    Cone[2].axis = vec3(0.0, -1.0, 0.0);
    Cone[2].materialID = 4;

    Cone[3].cosa = 0.7;
    Cone[3].height = 0.5;
    Cone[3].apex = vec3(19.5, 5.1 + 0.3 * cos(iTime * 5.0), 37.5);
    Cone[3].axis = vec3(0.0, 1.0, 0.0);
    Cone[3].materialID = 4;

    Cone[4].cosa = 0.7;
    Cone[4].height = 0.2;
    Cone[4].apex = vec3(Sphere[0].center.x, 4.5 - 0.2 * cos(iTime * 5.0), Sphere[0].center.z);
    Cone[4].axis = vec3(0.0, 1.0, 0.0);
    Cone[4].materialID = 2;

    Cone[5].cosa = 0.7;
    Cone[5].height = 0.2;
    Cone[5].apex = vec3(Sphere[0].center.x, 4.9 - 0.2 * cos(iTime * 5.0), Sphere[0].center.z);
    Cone[5].axis = vec3(0.0, -1.0, 0.0);
    Cone[5].materialID = 2;
}

void InitMoveLight(){
    Light[1].position = Sphere[0].center + vec3(3.0 * cos(iTime), 10.0, 3.0 * cos(iTime));
    Light[1].I_a = vec3( 0.13, 0.13, 0.13 );
    Light[1].I_source = vec3( 1.0, 1.0, 1.0 );
}

/////////////////////////////////////////////////////////////////////////////
// Initializes the scene.
/////////////////////////////////////////////////////////////////////////////
void InitScene()
{
    // Horizontal plane.
    Plane[0].A = 0.0;
    Plane[0].B = 1.0;
    Plane[0].C = 0.0;
    Plane[0].D = 0.0;
    Plane[0].type = 1;
    Plane[0].materialID = 5;

    //Vertical plane
    //Plane[1].A = 0.0;
    //Plane[1].B = 0.0;
    //Plane[1].C = 1.0;
    //Plane[1].D = -45.0;
    //Plane[1].type = 0;
    //Plane[1].materialID = 5;


    // Sphere.
    Sphere[0].center = vec3( 25.5, 3.6, 1.5 );
    Sphere[0].radius = 0.5;
    Sphere[0].materialID = 1;
    Sphere[0].BoxID = 0;
    
    InitMap();

    // Silver material.
    Material[5].k_d = vec3( 0.2775, 0.2775, 0.2775);
    Material[5].k_a = vec3(0.23125, 0.23125, 0.23125);
    Material[5].k_r = vec3(0.773911, 0.773911, 0.773911);
    Material[5].k_rg = 0.5 * Material[0].k_r;   
    Material[5].n = 89.6;


    // Gold material.
    Material[1].k_d = vec3( 0.8, 0.7, 0.1 );
    Material[1].k_a = 0.2 * Material[1].k_d;
    Material[1].k_r = 2.0 * Material[1].k_d;
    Material[1].k_rg = 0.5 * Material[1].k_r;
    Material[1].n = 64.0;

    // Green plastic material.
    Material[2].k_d = vec3( 0.0, 0.8, 0.0 );
    Material[2].k_a = 0.2 * Material[2].k_d;
    Material[2].k_r = vec3( 1.0, 1.0, 1.0 );
    Material[2].k_rg = 0.5 * Material[2].k_r;
    Material[2].n = 128.0;
    
    Material[3].k_d = vec3(0.714, 0.4284, 0.18144);
    Material[3].k_a = vec3(0.2125, 0.1275, 0.054);
    Material[3].k_r = vec3(0.393548, 0.271906, 0.166721);
    Material[3].k_rg = 0.5 * Material[0].k_r;   
    Material[3].n = 25.6;
    
    Material[4].k_d = vec3(0.61424, 0.04136, 0.04136);
    Material[4].k_a = vec3(0.1745, 0.01175, 0.01175);
    Material[4].k_r = vec3(0.727811, 0.626959, 0.626959);
    Material[4].k_rg = 0.5 * Material[0].k_r;   
    Material[4].n = 76.8;
    
    Material[0].k_d = vec3(0.0, 0.0, 0.0);
    Material[0].k_a = vec3(0.1745, 0.01175, 0.01175);
    Material[0].k_r = vec3(0.0, 0.0, 0.0);
    Material[0].k_rg = 0.5 * Material[0].k_r;   
    Material[0].n = 20.0;

    // Light 0.
    // Light[0].position = vec3( 4.0, 8.0, -3.0 );
    // Light[0].I_a = vec3( 0.1, 0.1, 0.1 );
    // Light[0].I_source = vec3( 1.0, 1.0, 1.0 );
    Light[0].position = vec3(19.5, 50.0, 19.5);
    Light[0].I_a = vec3(0.25, 0.25, 0.25);
    Light[0].I_source = vec3(1.0, 1.0, 1.0);
    // Light 1.
    // Light[1].position = vec3( -4.0, 8.0, 0.0 );
    // Light[1].I_a = vec3( 0.1, 0.1, 0.1 );
    // Light[1].I_source = vec3( 1.0, 1.0, 1.0 );

}



/////////////////////////////////////////////////////////////////////////////
// Computes intersection between a plane and a ray.
// Returns true if there is an intersection where the ray parameter t is
// between tmin and tmax, otherwise returns false.
// If there is such an intersection, outputs the value of t, the position
// of the intersection (hitPos) and the normal vector at the intersection 
// (hitNormal).
/////////////////////////////////////////////////////////////////////////////
bool IntersectPlane( in Plane_t pln, in Ray_t ray, in float tmin, in float tmax,
                     out float t, out vec3 hitPos, out vec3 hitNormal ) 
{
    vec3 N = vec3( pln.A, pln.B, pln.C );
    float NRd = dot( N, ray.d );
    float NRo = dot( N, ray.o );
    float t0 = (-pln.D - NRo) / NRd;
    if ( t0 < tmin || t0 > tmax ) return false;

    // We have a hit -- output results.
    t = t0;
    hitPos = ray.o + t0 * ray.d;
    if (hitPos.x < -0.0 || hitPos.x > 39.0 ||
        hitPos.z < -0.0 || hitPos.z > 39.0)
        return false;
    hitNormal = normalize( N );
    return true;
}



/////////////////////////////////////////////////////////////////////////////
// Computes intersection between a plane and a ray.
// Returns true if there is an intersection where the ray parameter t is
// between tmin and tmax, otherwise returns false.
/////////////////////////////////////////////////////////////////////////////
bool IntersectPlane( in Plane_t pln, in Ray_t ray, in float tmin, in float tmax )
{
    vec3 N = vec3( pln.A, pln.B, pln.C );
    float NRd = dot( N, ray.d );
    float NRo = dot( N, ray.o );
    float t0 = (-pln.D - NRo) / NRd;
    if ( t0 < tmin || t0 > tmax ) return false;

    float t = t0;
    vec3 hitPos = ray.o + t0 * ray.d;
    if (hitPos.x < -50.0 || hitPos.x > 50.0 ||
        hitPos.z < -50.0 || hitPos.z > 50.0)
        return false;
    return true;
}

// Movement of the sphere
vec4 ChangeCenter() {
	return texture(iChannel1, vec2(0.0)).xyzw;
}

/////////////////////////////////////////////////////////////////////////////
// Computes intersection between a sphere and a ray.
// Returns true if there is an intersection where the ray parameter t is
// between tmin and tmax, otherwise returns false.
// If there is one or two such intersections, outputs the value of the 
// smaller t, the position of the intersection (hitPos) and the normal 
// vector at the intersection (hitNormal).
/////////////////////////////////////////////////////////////////////////////
bool IntersectSphere( in Sphere_t sph, in Ray_t ray, in float tmin, in float tmax,
                      out float t, out vec3 hitPos, out vec3 hitNormal ) 
{
    /////////////////////////////////
    // TASK: WRITE YOUR CODE HERE. //
    /////////////////////////////////
    //*** calculate a, b and c
    float a = dot(ray.d, ray.d);
    float b = 2.0 * dot(ray.o, ray.d) - 2.0 * dot(sph.center, ray.d);
    float c = dot(ray.o, ray.o) - 2.0 * dot(sph.center, ray.o) + dot(sph.center, sph.center) - sph.radius * sph.radius;
    float delta = b * b - 4.0 * a * c;
    //solution
    float t_sol;
    float t_neg = (-b - sqrt(delta)) / (2.0 * a);
    float t_pos = (-b + sqrt(delta)) / (2.0 * a);
    //select t
    if(t_neg >= 0.0){
        t_sol = t_neg;
    }
    else if(t_pos >= 0.0){
        t_sol = t_pos;
    }
    else{
        t_sol = -1.0;    //just false
        return false;
    }
    if(t_sol > tmax || t_sol < tmin) return false;
    t = t_sol;
    hitPos = ray.o + t * ray.d;
    hitNormal = normalize(hitPos - sph.center);
    return true;
}


/////////////////////////////////////////////////////////////////////////////
// Computes intersection between a sphere and a ray.
// Returns true if there is an intersection where the ray parameter t is
// between tmin and tmax, otherwise returns false.
/////////////////////////////////////////////////////////////////////////////
bool IntersectSphere( in Sphere_t sph, in Ray_t ray, in float tmin, in float tmax )
{
    /////////////////////////////////
    // TASK: WRITE YOUR CODE HERE. //
    /////////////////////////////////
    //*** calculate a, b and c
    float a = dot(ray.d, ray.d);
    float b = 2.0 * dot(ray.o, ray.d) - 2.0 * dot(sph.center, ray.d);
    float c = dot(ray.o, ray.o) - 2.0 * dot(sph.center, ray.o) + dot(sph.center, sph.center) - sph.radius * sph.radius;
    float delta = b * b - 4.0 * a * c;
    //solution
    float t_sol;
    float t_neg = (-b - sqrt(delta)) / (2.0 * a);
    float t_pos = (-b + sqrt(delta)) / (2.0 * a);
    //select t
    if(t_neg >= 0.0){
        t_sol = t_neg;
    }
    else if(t_pos >= 0.0){
        t_sol = t_pos;
    }
    else{
        t_sol = -1.0;    //just false
        return false;
    }
    if(t_sol > tmax || t_sol < tmin) return false;
    return true;

}

/////////////////////////////////////////////////////////////////////////////
// Computes intersection between a AABox and a ray.
// Returns true if there is an intersection where the ray parameter t is
// between tmin and tmax, otherwise returns false.
// If there is one or two such intersections, outputs the value of the 
// smaller t, the position of the intersection (hitPos) and the normal 
// vector at the intersection (hitNormal).
/////////////////////////////////////////////////////////////////////////////
bool IntersectAABox( in AABox_t box, in Ray_t ray, in float tmin, in float tmax,
                      out float t, out vec3 hitPos, out vec3 hitNormal ) 
{
    float t_min = tmin;
    float t_max = tmax;

    for(int axis = 0; axis < 3; axis++)
    {
        float axis_min = box.center[axis] - box.size[axis] * 0.5;
        float axis_max = axis_min + box.size[axis];

        if(abs(ray.d[axis]) < 0.0001)
        {
            if(ray.o[axis] < axis_min || ray.o[axis] > axis_max)
                return false;
        }
        else
        {
            //figure out the intersection times of the ray with the 2 values of this axis
			float axis_min_t = (axis_min - ray.o[axis]) / ray.d[axis];
			float axis_max_t = (axis_max - ray.o[axis]) / ray.d[axis];

			//make sure min < max
			if(axis_min_t > axis_max_t)
			{
				float temp = axis_min_t;
				axis_min_t = axis_max_t;
				axis_max_t = temp;
			}

			//union this time slice with our running total time slice
			if(axis_min_t > t_min)
				t_min = axis_min_t;

			if(axis_max_t < t_max)
				t_max = axis_max_t;

			//if our time slice shrinks to below zero of a time window, we don't intersect
			if(t_min > t_max)
				return false;
        }
    }


    bool isInside = (t_min == tmin);
    if(isInside)
        t = t_max;
    else
        t = t_min;

    hitPos = ray.o + t * ray.d;
    
    float closestDist = tmax;
	for(int axis = 0; axis < 3; ++axis)
	{
		float distFromPos = abs(box.center[axis] - hitPos[axis]);
		float distFromEdge = abs(distFromPos - (box.size[axis] * 0.5));

		if(distFromEdge < closestDist)
		{
			closestDist = distFromEdge;
			hitNormal = vec3(0.0, 0.0, 0.0);
			if(hitPos[axis] < box.center[axis])
				hitNormal[axis] = -1.0;
			else
				hitNormal[axis] =  1.0;
		}
	}
    if(isInside)
        hitNormal *= -1.0;
    return true;
}

/////////////////////////////////////////////////////////////////////////////
// Computes intersection between a AABox and a ray.
// Returns true if there is an intersection where the ray parameter t is
// between tmin and tmax, otherwise returns false.
// If there is one or two such intersections, outputs the value of the 
// smaller t, the position of the intersection (hitPos) and the normal 
// vector at the intersection (hitNormal).
/////////////////////////////////////////////////////////////////////////////
bool IntersectAABox( in AABox_t box, in Ray_t ray, in float tmin, in float tmax ) 
{
    float t_min = tmin;
    float t_max = tmax;

    for(int axis = 0; axis < 3; axis++)
    {
        float axis_min = box.center[axis] - box.size[axis] * 0.5;
        float axis_max = axis_min + box.size[axis];

        if(abs(ray.d[axis]) < 0.0001)
        {
            if(ray.o[axis] < axis_min || ray.o[axis] > axis_max)
                return false;
        }
        else
        {
            //figure out the intersection times of the ray with the 2 values of this axis
			float axis_min_t = (axis_min - ray.o[axis]) / ray.d[axis];
			float axis_max_t = (axis_max - ray.o[axis]) / ray.d[axis];

			//make sure min < max
			if(axis_min_t > axis_max_t)
			{
				float temp = axis_min_t;
				axis_min_t = axis_max_t;
				axis_max_t = temp;
			}

			//union this time slice with our running total time slice
			if(axis_min_t > t_min)
				t_min = axis_min_t;

			if(axis_max_t < t_max)
				t_max = axis_max_t;

			//if our time slice shrinks to below zero of a time window, we don't intersect
			if(t_min > t_max)
				return false;
        }
    }
    return true;
}

bool IntersectCone( in Cone_t cone, in Ray_t ray, in float tmin, in float tmax,
                      out float t, out vec3 hitPos, out vec3 hitNormal ) 
{
    vec3 co = ray.o - cone.apex;
    float a = dot(ray.d, cone.axis) * dot(ray.d, cone.axis) - cone.cosa * cone.cosa;
    float b = 2.0 * (dot(ray.d, cone.axis)*dot(co, cone.axis) - dot(ray.d, co) * cone.cosa * cone.cosa);
    float c = dot(co, cone.axis) * dot(co, cone.axis) - dot(co, co) * cone.cosa * cone.cosa;

    float det = b * b - 4.0 * a * c;
    if (det < 0.0) return false;

    det = sqrt(det);
    float t1 = (-b - det) / (2.0 * a);
    float t2 = (-b + det) / (2.0 * a);

    t = t1;
    if (t < tmin || t2 > tmin && t2 < t) t = t2;
    if (t < tmin || t > tmax) return false;

    hitPos = ray.o + t * ray.d;
    vec3 cp = hitPos - cone.apex;
    float h = dot(cp, cone.axis);
    if (h < 0. || h > cone.height) return false;

    hitNormal = normalize(cp * dot(cone.axis, cp) / dot(cp, cp) - cone.axis);

    return true;
}

bool IntersectCone( in Cone_t cone, in Ray_t ray, in float tmin, in float tmax )
{
    vec3 co = ray.o - cone.apex;
    float a = dot(ray.d, cone.axis) * dot(ray.d, cone.axis) - cone.cosa * cone.cosa;
    float b = 2.0 * (dot(ray.d, cone.axis) * dot(co, cone.axis) - dot(ray.d, co) * cone.cosa * cone.cosa);
    float c = dot(co, cone.axis) * dot(co, cone.axis) - dot(co, co) * cone.cosa * cone.cosa;
        
    float det = b * b - 4.0 * a * c;
    if (det < 0.0) return false;

    det = sqrt(det);
    float t1 = (-b - det) / (2.0 * a);
    float t2 = (-b + det) / (2.0 * a);

    float t = t1;
    if (t < tmin || t2 > tmin && t2 < t) t = t2;
    if (t < tmin || t > tmax) return false;

    vec3 cp = ray.o + t * ray.d - cone.apex;
    float h = dot(cp, cone.axis);
    if (h < 0.0 || h > cone.height) return false;

    return true;
}


/////////////////////////////////////////////////////////////////////////////
// Computes (I_a * k_a) + k_shadow * I_source * [ k_d * (N.L) + k_r * (R.V)^n ].
// Input vectors L, N and V are pointing AWAY from surface point.
// Assume all vectors L, N and V are unit vectors.
/////////////////////////////////////////////////////////////////////////////
vec3 PhongLighting( in vec3 L, in vec3 N, in vec3 V, in bool inShadow, 
                    in Material_t mat, in Light_t light )
{
    if ( inShadow ) {
        return light.I_a * mat.k_a;
    }
    else {
        vec3 R = reflect( -L, N );
        float N_dot_L = max( 0.0, dot( N, L ) );
        float R_dot_V = max( 0.0, dot( R, V ) );
        float R_dot_V_pow_n = ( R_dot_V == 0.0 )? 0.0 : pow( R_dot_V, mat.n );

        return light.I_a * mat.k_a + 
               light.I_source * (mat.k_d * N_dot_L + mat.k_r * R_dot_V_pow_n);
    }
}
//texture phong lighting
vec3 PhongLighting( in vec3 L, in vec3 N, in vec3 V, in bool inShadow, 
                    in vec2 tex_coord, in Light_t light )
{
    vec3 dcolor = texture(iChannel0, tex_coord).rgb;
    vec3 r = 2.0 * dcolor;
    vec3 a = 0.2 * dcolor;
    float n = 64.0;
    if ( inShadow ) {
        return light.I_a * a;
    }
    else {
        vec3 R = reflect( -L, N );
        float N_dot_L = max( 0.0, dot( N, L ) );
        float R_dot_V = max( 0.0, dot( R, V ) );
        float R_dot_V_pow_n = ( R_dot_V == 0.0 )? 0.0 : pow( R_dot_V, n );

        return light.I_a * a + 
               light.I_source * (dcolor * N_dot_L + r * R_dot_V_pow_n);
    }
}

/////////////////////////////////////////////////////////////////////////////
// Casts a ray into the scene and returns color computed at the nearest
// intersection point. The color is the sum of light from all light sources,
// each computed using Phong Lighting Model, with consideration of
// whether the interesection point is being shadowed from the light.
// If there is no interesection, returns the background color, and outputs
// hasHit as false.
// If there is intersection, returns the computed color, and outputs
// hasHit as true, the 3D position of the intersection (hitPos), the
// normal vector at the intersection (hitNormal), and the k_rg value
// of the material of the intersected object.
/////////////////////////////////////////////////////////////////////////////
vec3 CastRay( in Ray_t ray, 
              out bool hasHit, out bool isRefract, out vec3 hitPos, out vec3 hitNormal, out vec3 k_rg ) 
{
    // Find whether and where the ray hits some object. 
    // Take the nearest hit point.
    isRefract = false;
    bool hasHitSomething = false;
    float nearest_t = DEFAULT_TMAX;   // The ray parameter t at the nearest hit point.
    vec3 nearest_hitPos;              // 3D position of the nearest hit point.
    vec3 nearest_hitNormal;           // Normal vector at the nearest hit point.
    int nearest_hitMatID;             // MaterialID of the object at the nearest hit point.

    float temp_t;
    vec3 temp_hitPos;
    vec3 temp_hitNormal;
    bool temp_hasHit;

    /////////////////////////////////////////////////////////////////////////////
    // TASK:
    // * Try interesecting input ray with all the planes and spheres,
    //   and record the front-most (nearest) interesection.
    // * If there is interesection, need to record hasHitSomething,
    //   nearest_t, nearest_hitPos, nearest_hitNormal, nearest_hitMatID.
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////
    // TASK: WRITE YOUR CODE HERE. //
    /////////////////////////////////
    int plane_num = NUM_PLANES;
    int sphere_num = NUM_SPHERES;
    int aabox_num = NUM_AABOXES;
    //calculate sphere intersection
    for(int i = 0; i < sphere_num; i++){
		temp_hasHit = IntersectSphere( Sphere[i], ray, DEFAULT_TMIN, DEFAULT_TMAX,
                  temp_t, temp_hitPos, temp_hitNormal );

		if(temp_hasHit && temp_t < nearest_t){
			hasHitSomething = true;
			nearest_t = temp_t;
			nearest_hitPos = temp_hitPos;
			nearest_hitNormal = temp_hitNormal;
			nearest_hitMatID = Sphere[i].materialID;
		}
    }

    //calculate aabox intersection
    for(int i = 0; i < aabox_num; i++){
        temp_hasHit = IntersectAABox(AABox[i], ray, DEFAULT_TMIN, DEFAULT_TMAX, temp_t, temp_hitPos, temp_hitNormal);
        if(temp_hasHit) hasHitSomething = true;
        if(temp_hasHit && temp_t < nearest_t){
            isRefract = true;
            nearest_t = temp_t;
            nearest_hitPos = temp_hitPos;
            nearest_hitNormal = temp_hitNormal;
            nearest_hitMatID = AABox[i].materialID;
        }
    }

    // calculate cone intersection
    for(int i = 0; i < NUM_CONES; i++){
        temp_hasHit = IntersectCone(Cone[i], ray, DEFAULT_TMIN, DEFAULT_TMAX, temp_t, temp_hitPos, temp_hitNormal);
        if(temp_hasHit) hasHitSomething = true;
        if(temp_hasHit && temp_t < nearest_t){
            nearest_t = temp_t;
            isRefract = false;
            nearest_hitPos = temp_hitPos;
            nearest_hitNormal = temp_hitNormal;
            nearest_hitMatID = Cone[i].materialID;
        }
    }

    //calculate plane intersection
    bool is_plane = false;
    
    Plane_t hit_plane;
    for(int i = 0; i < plane_num; i++){
        temp_hasHit = IntersectPlane(Plane[i], ray, DEFAULT_TMIN, DEFAULT_TMAX, temp_t, temp_hitPos, temp_hitNormal);
        if(temp_hasHit) hasHitSomething = true;
        if(temp_hasHit && temp_t < nearest_t){
            nearest_t = temp_t;
            isRefract = false;
            nearest_hitPos = temp_hitPos;
            nearest_hitNormal = temp_hitNormal;
            is_plane = true;
            hit_plane = Plane[i];
            nearest_hitMatID = Plane[i].materialID;
        }
    }
    // One of the output results.
    hasHit = hasHitSomething;
    if ( !hasHitSomething ) {
        return vec3(0.0);
    }
    vec3 I_local = vec3( 0.0 );  // Result color will be accumulated here.

    /////////////////////////////////////////////////////////////////////////////
    // TASK:
    // * Accumulate lighting from each light source on the nearest hit point. 
    //   They are all accumulated into I_local.
    // * For each light source, make a shadow ray, and check if the shadow ray
    //   intersects any of the objects (the planes and spheres) between the 
    //   nearest hit point and the light source.
    // * Then, call PhongLighting() to compute lighting for this light source.
    /////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////
    // TASK: WRITE YOUR CODE HERE. //
    /////////////////////////////////
    for(int i = 0; i < NUM_LIGHTS; i++) {

        //***for each light source, make a shadow ray
        Ray_t shadowRay;
        shadowRay.o = nearest_hitPos;
        shadowRay.d = normalize(Light[i].position - nearest_hitPos);
        bool isShadow = false;
        //*** iterate all planes and spheres in the shadow ray
        float max_dis = sqrt(dot(Light[i].position - nearest_hitPos, Light[i].position - nearest_hitPos));
        for(int j = 0; j < NUM_SPHERES; j++){
            if(IntersectSphere(Sphere[j], shadowRay, DEFAULT_TMIN, max_dis)){
                isShadow = true;
                break;
            }
        }
        //***
        if(!isShadow){
            for(int n = 0; n < NUM_PLANES; n++){
                if(IntersectPlane(Plane[n], shadowRay, DEFAULT_TMIN, max_dis)){
                    isShadow = true;
                    break;
                }
            }
        }

        if(!isShadow){
            for(int n = 0; n < NUM_AABOXES; n++){
                if(IntersectAABox(AABox[n], shadowRay, DEFAULT_TMIN, max_dis)){
                    isShadow = true;
                    break;
                }
            }
        }

        if(!isShadow){
            for(int n = 0; n < NUM_CONES; n++){
                if(IntersectCone(Cone[n], shadowRay, DEFAULT_TMIN, max_dis)){
                    isShadow = true;
                    break;
                }
            }
        }

        //***phong lighting
        vec3 phong;
        if(!is_plane || (is_plane && hit_plane.type == 0)) {
            phong = PhongLighting(shadowRay.d, nearest_hitNormal, -ray.d, isShadow, Material[nearest_hitMatID], Light[i]);
        }
        else {
            vec2 tex_coord = nearest_hitPos.xz / 100.0;
            phong = PhongLighting(shadowRay.d, nearest_hitNormal, -ray.d, isShadow, tex_coord, Light[i]); 
        }
        I_local = I_local + phong;
    }


    // Populate output results.
    hitPos = nearest_hitPos;
    hitNormal = nearest_hitNormal;
    k_rg = Material[nearest_hitMatID].k_rg;

    return I_local;
}

void Success(out vec4 fragColor, in vec2 fragCoord)
{
    float t = iTime;
    vec2 r = iResolution.xy;
    vec3 c;
	float l;
    float z=t;
	for(int i=0;i<3;i++) {
		vec2 uv,p=fragCoord.xy/r;
		uv=p;
		p-=.5;
		p.x*=r.x/r.y;
		z+=.07;
		l=length(p);
		uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));
		c[i]=.01/length(abs(mod(uv,1.)-.5));
	}
	fragColor=vec4(c/l,t);
}

/////////////////////////////////////////////////////////////////////////////
// Execution of fragment shader starts here.
// 1. Initializes the scene.
// 2. Compute a primary ray for the current pixel (fragment).
// 3. Trace ray into the scene with NUM_ITERATIONS recursion levels.
/////////////////////////////////////////////////////////////////////////////
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Initialize scene
    InitScene();
    
    // Sphere move 
    vec4 Press = ChangeCenter();
    vec3 move = Press.xyz;
    float f_press = Press.w;
    if (int(move.y) == 1)
    {
        Success(fragColor, fragCoord);
    }
    else
    {
        Sphere[0].center.x = Sphere[0].center.x + move.x;
        Sphere[0].center.z = move.z + Sphere[0].center.z;
        Cone[4].apex = vec3(Sphere[0].center.x, 4.5 - 0.2 * cos(iTime * 5.0), Sphere[0].center.z);
        Cone[5].apex = vec3(Sphere[0].center.x, 4.9 - 0.2 * cos(iTime * 5.0), Sphere[0].center.z);
        //move light
        InitMoveLight();
        // Scale pixel 2D position such that its y coordinate is in [-1.0, 1.0].
        vec2 pixel_pos = (2.0 * fragCoord.xy - iResolution.xy) / iResolution.y;
        
        
        // Camera Setup
        vec2 mouse = iMouse.xy / iResolution.xy * .5;
        float angleX = iMouse.z > 0.0 ? 6.28 * mouse.x : 3.14 + 0.0;
        float angleY = iMouse.z > 0.0 ? (mouse.y * 6.28) - 0.4 : 0.3;
        vec3 cam_angle;
        if(f_press == 1.0){
            cam_angle = (vec3(sin(angleX)*cos(angleY), sin(angleY), cos(angleX)*cos(angleY))) * 8.0;
        }
        else{
            cam_angle = (vec3(sin(angleX)*cos(angleY), sin(angleY), cos(angleX)*cos(angleY))) * 3.0;
        }
        vec3 cam_lookat = Sphere[0].center;
        vec3 cam_pos = cam_lookat + cam_angle;
        //vec3 cam_pos = vec3(19.5, 40, 0.0);
        //vec3 cam_lookat = vec3(19.5, 0, 19.5);
        
        vec3 cam_fwd  = normalize(-cam_angle);
        vec3 cam_left = normalize(cross(cam_fwd, vec3(0.0, sign(cos(angleY)), 0.0)));
        vec3 cam_up_vec = normalize(cross(cam_left, cam_fwd));
        //vec3 cam_up_vec = normalize(vec3(0.0, 1.0, 1.0));

        // Set up camera coordinate frame in world space.
        vec3 cam_z_axis = normalize( cam_angle );
        vec3 cam_x_axis = normalize( cross(cam_up_vec, cam_z_axis) );
        vec3 cam_y_axis = normalize( cross(cam_z_axis, cam_x_axis));
        
        

        // Create primary ray.
        float pixel_pos_z = -1.0 / tan(FOVY / 2.0);
        Ray_t pRay;
        pRay.o = cam_pos;
        pRay.d = normalize( pixel_pos.x * cam_x_axis  +  pixel_pos.y * cam_y_axis  +  pixel_pos_z * cam_z_axis );


        // Start Ray Tracing.
        // Use iterations to emulate the recursion.

        bool isRefract;
        vec3 I_result = vec3( 0.0 );
        vec3 refraction = vec3(0.0);
        vec3 compounded_k_rg = vec3( 1.0 );
        Ray_t nextRay = pRay;

        for ( int level = 0; level <= NUM_ITERATIONS; level++ ) 
        {
            bool hasHit;
            vec3 hitPos, hitNormal, k_rg;

            vec3 I_local = CastRay( nextRay, hasHit, isRefract, hitPos, hitNormal, k_rg );

            
            if (isRefract) {
                I_result += 0.0 * I_local;
            }
            else
            {
                I_result += compounded_k_rg * I_local;
                compounded_k_rg *= k_rg;
            }
                
            if ( !hasHit ) break;

            if (!isRefract)
                nextRay = Ray_t( hitPos, normalize( reflect(nextRay.d, hitNormal) ) );
            else
                nextRay = Ray_t( hitPos, normalize( refract(nextRay.d, hitNormal, 0.8) ) );
        }

        fragColor = vec4( I_result, 1.0 );
    }
}
