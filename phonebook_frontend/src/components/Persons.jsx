const Persons = ({
    list, onDelete
}) => {
    return(
<div>
    {list.map((person)=> (
        <div key={person.id} >
            {person.name} {person.number}
            <button onClick={() => onDelete(person.id)}>Delete</button>
            </div>
    ))}
    </div>
    )
}

export default Persons;