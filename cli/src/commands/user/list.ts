import { mapUser } from '../../views/model.view';
import { printTable } from 'console-table-printer';
import { BaseCommand } from '../../utils';

export default class UserListCommand extends BaseCommand {
  static description = 'List users of the account service';

  static examples = [`$ api-service user:list`];

  static flags = Object.assign({}, BaseCommand.baseFlags);

  async run() {
    const { args, flags } = this.parse(UserListCommand);

    this.apiServiceUrl = flags.url;

    const users = await this.getUsers();

    if (users.length > 0) {
      const userTableData = users.map(user => mapUser(user));

      printTable(userTableData);
    } else {
      console.log('The user database is empty.');
    }
  }
}
