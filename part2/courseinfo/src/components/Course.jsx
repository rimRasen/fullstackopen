import React from 'react';

const Header = ({ course }) => {
    return <h1>{course.name}</h1>;
}
const Part = ({ name, exercises }) => {
    return (
      <p>
        {name} {exercises}
        </p>
    );
};
  
const Content = ({ parts }) => {
    return ( 
        <div>
            {parts.map(part => (
            <Part key={part.id} name={part.name} exercises={part.exercises} />
            ))}
        </div>
    )
}
  
const Total = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0);
    return <p><strong>Number of exercises {total}</strong></p>;
}

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    );
}

export default Course;