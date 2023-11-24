interface IColorSquareProps {
    color: string;
}

export default function ColorSquare({ color }: IColorSquareProps) {
    return (
        <span
            className="inline-block h-3 w-3 border-2 border-solid border-gray-500"
            style={{
                backgroundColor: color || 'white',
            }}
        />
    );
}
