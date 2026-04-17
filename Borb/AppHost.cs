var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.src>("src");

builder.Build().Run();
