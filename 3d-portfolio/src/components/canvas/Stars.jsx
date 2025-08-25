import React from 'react';

const Stars = () => {
    return (
        <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
};

export default Stars;