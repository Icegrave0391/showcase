const float KEY_LEFT  = 37.5/256.0;
const float KEY_UP    = 38.5/256.0;
const float KEY_RIGHT = 39.5/256.0;
const float KEY_DOWN  = 40.5/256.0;
const float KEY_W     = 82.5/256.0;

const float MOVE_SPEED = 50.0;
//const float ROT_SPEED = 4.0;
const int NUM_AABOXES = 29;
struct AABox_t {
    vec3 center;
    vec3 size;
    int materialID;
};
AABox_t AABox[NUM_AABOXES];

bool isKeyPressed(float key)
{
	return texture(iChannel1, vec2(key, 0.5/3.0) ).x > 0.5;
}

void init(){
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
}

bool onBox(vec2 position2D){
    int flag = 0;
    float curr_x = position2D.x;
    float curr_z = position2D.y;
    for(int i = 0 ; i < NUM_AABOXES ; i++){
        float left_side = AABox[i].center.x - AABox[i].size.x * 0.5;
        float right_side = AABox[i].center.x + AABox[i].size.x * 0.5;
        float front_side = AABox[i].center.z + AABox[i].size.z * 0.5;
        float back_side = AABox[i].center.z - AABox[i].size.z * 0.5;
        if((curr_x >= left_side && curr_x <= right_side) && (curr_z >= back_side && curr_z <= front_side)){
            flag = 1;
            break;
        }
    }
    if(flag == 1) return true;
    return false;
}

bool atEnd(vec2 position2D){
    vec2 final_point = vec2(19.5, 37.5);
    float curr_x = position2D.x;
    float curr_z = position2D.y;
    if(curr_x >= final_point.x - 0.5 && curr_x <= final_point.x + 0.5 && curr_z >= final_point.y - 0.5 && curr_z <= final_point.y + 0.5){
        return true;
    }
    return false;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    init();
    vec2 uv = fragCoord / iResolution.xy;
    vec4 col = vec4(0.0);
    
    if (fragCoord.x < 1.0 && fragCoord.y < 1.0) 
    {
        col = texture(iChannel0, uv);
        vec2 origin_pos = vec2(25.5, 1.5);
        float moveLength = MOVE_SPEED * iTimeDelta * 0.25;
        if(!atEnd(origin_pos + col.xz)){
            if (isKeyPressed(KEY_UP)) {
                vec2 temp_pos = origin_pos + vec2(col.x, col.z + moveLength);
                if(onBox(temp_pos)){
                    col.z += moveLength;
                    col.w = 1.0;
                }
            }
            if (isKeyPressed(KEY_DOWN)) {
                vec2 temp_pos = origin_pos + vec2(col.x, col.z - moveLength);
                if(onBox(temp_pos)){
                    col.z -= moveLength;
                    col.w = 2.0;
                }
            }
        
            if (isKeyPressed(KEY_RIGHT)) {
                vec2 temp_pos = origin_pos + vec2(col.x - moveLength, col.z);
                if(onBox(temp_pos)){
                    col.x -= moveLength;
                    col.w = 4.0;
                }
            }
            if (isKeyPressed(KEY_LEFT)) {
                vec2 temp_pos = origin_pos + vec2(col.x + moveLength, col.z);
                if(onBox(temp_pos)){
                    col.x += moveLength;
                    col.w = 3.0;
                }
            }
        }
        
        if (isKeyPressed(KEY_W)) {
            col = vec4(0.0);
        }
    }
    
    fragColor = col;
}
