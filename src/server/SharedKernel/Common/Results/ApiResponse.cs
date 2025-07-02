namespace Common.Results;

public class ApiResponse<T>(T data)
{
	public T Data { get; } = data;
}