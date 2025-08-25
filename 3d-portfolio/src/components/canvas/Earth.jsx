import React from 'react';

const Earth = () => {
    return (
        <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
                map={new THREE.TextureLoader().load('/path/to/earth_texture.jpg')} 
                bumpMap={new THREE.TextureLoader().load('/path/to/earth_bump.jpg')} 
                bumpScale={0.05} 
            />
        </mesh>
    );
};

export default Earth;