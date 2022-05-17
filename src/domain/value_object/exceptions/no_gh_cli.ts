class NoGithubCli extends Error{
  constructor(name: string, message?: string){
    super();
    this.name = name;
    if (message){
      this.message = message;
    }
  }
}