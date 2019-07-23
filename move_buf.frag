const float KEY_LEFT  = 37.5/256.0;
const float KEY_UP    = 38.5/256.0;
const float KEY_RIGHT = 39.5/256.0;
const float KEY_DOWN  = 40.5/256.0;
const float KEY_W     = 82.5/256.0;

const float MOVE_SPEED = 4.0;
//const float ROT_SPEED = 4.0;

bool isKeyPressed(float key)
{
	return texture(iChannel1, vec2(key, 0.5/3.0) ).x > 0.5;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord / iResolution.xy;
    vec4 col = vec4(0.0);
    
    if (fragCoord.x < 1.0 && fragCoord.y < 1.0) 
    {
        col = texture(iChannel0, uv);
        //vec2 fwd = MOVE_SPEED * iTimeDelta * vec2(sin(col.a), cos(col.a));
        float moveLength = MOVE_SPEED * iTimeDelta * 0.25;
        
        if (isKeyPressed(KEY_UP)) {
            col.z += moveLength;
            col.w = 1.0;
        }
        if (isKeyPressed(KEY_DOWN)) {
            col.z -= moveLength;
            col.w = 2.0;
        }
        
        if (isKeyPressed(KEY_RIGHT)) {
            col.x -= moveLength;
            col.w = 4.0;
        }
        if (isKeyPressed(KEY_LEFT)) {
            col.x += moveLength;
            col.w = 3.0;
        }
        if (isKeyPressed(KEY_W)) {
            col = vec4(0.0);
        }
    }
    
    fragColor = col;
}
